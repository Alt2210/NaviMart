import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Family } from '../families/schemas/family.schema';
import { Recipe, RecipeDocument } from '../recipes/schemas/recipe.schema';
import {
  ShoppingList,
  ShoppingListDocument,
  ShoppingListItem,
} from '../shopping-lists/schemas/shopping-list.schema';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { MissingIngredientsService } from './missing-ingredients.service';

@Injectable()
export class ShoppingListGenerationService {
  constructor(
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
    @InjectModel(ShoppingList.name)
    private readonly shoppingListModel: Model<ShoppingList>,
    private readonly missingIngredientsService: MissingIngredientsService,
  ) {}

  async generateFromRecipe(
    user: AuthenticatedUser,
    recipeId: string,
    dto: GenerateShoppingListDto,
  ) {
    const familyId = await this.getActiveFamilyId(user);
    const recipe = await this.findRecipe(recipeId);

    return this.createShoppingListFromRecipe(
      user,
      familyId,
      recipe,
      dto.servings ?? recipe.servings,
      dto,
    );
  }

  async generateFromMeal(
    user: AuthenticatedUser,
    recipeId: string,
    servings: number,
    dto: GenerateShoppingListDto,
  ) {
    const familyId = await this.getActiveFamilyId(user);
    const recipe = await this.findRecipe(recipeId);

    return this.createShoppingListFromRecipe(
      user,
      familyId,
      recipe,
      servings,
      dto,
    );
  }

  private async createShoppingListFromRecipe(
    user: AuthenticatedUser,
    familyId: Types.ObjectId,
    recipe: RecipeDocument,
    servings: number,
    dto: GenerateShoppingListDto,
  ) {
    const missingSummary =
      await this.missingIngredientsService.calculateMissingIngredients(
        familyId,
        recipe,
        servings,
      );

    if (!missingSummary.hasMissingIngredients) {
      throw new BadRequestException('Recipe has no missing ingredients');
    }

    const list = await this.shoppingListModel.create({
      familyId,
      name: dto.name ?? `Nguyen lieu cho ${recipe.name}`,
      type: 'custom',
      plannedFor: dto.plannedFor,
      createdBy: new Types.ObjectId(user.userId),
      items: missingSummary.missingIngredients.map((ingredient) => ({
        foodId: ingredient.foodId
          ? new Types.ObjectId(ingredient.foodId)
          : undefined,
        categoryId: ingredient.categoryId
          ? new Types.ObjectId(ingredient.categoryId)
          : undefined,
        name: ingredient.name,
        quantity: ingredient.missingQuantity,
        unit: ingredient.unit,
        note: `Generated from recipe: ${recipe.name}`,
      })) as ShoppingListItem[],
    });

    return {
      shoppingList: this.toShoppingListResponse(list),
      missingSummary,
    };
  }

  private async findRecipe(recipeId: string) {
    const recipe = await this.recipeModel
      .findOne({ _id: recipeId, status: { $ne: 'archived' } })
      .exec();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  private async getActiveFamilyId(user: AuthenticatedUser) {
    if (!user.activeFamilyId) {
      throw new ForbiddenException('User is not attached to a family');
    }

    const family = await this.familyModel
      .findById(user.activeFamilyId)
      .select('_id members')
      .lean()
      .exec();

    const member = family?.members.find(
      (item) =>
        item.userId.toString() === user.userId && item.status === 'active',
    );

    if (!member) {
      throw new ForbiddenException('User is not an active family member');
    }

    return new Types.ObjectId(user.activeFamilyId);
  }

  private toShoppingListResponse(list: ShoppingListDocument | ShoppingList) {
    return {
      id: list._id.toString(),
      familyId: list.familyId.toString(),
      name: list.name,
      type: list.type,
      status: list.status,
      plannedFor: list.plannedFor,
      completedAt: list.completedAt,
      createdBy: list.createdBy.toString(),
      progress: {
        bought: list.items.filter((item) => item.status === 'bought').length,
        total: list.items.length,
      },
      items: list.items.map((item) => ({
        id: item._id.toString(),
        foodId: item.foodId?.toString(),
        categoryId: item.categoryId?.toString(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        checked: item.checked,
        status: item.status,
        note: item.note,
        boughtAt: item.boughtAt,
      })),
    };
  }
}
