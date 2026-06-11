import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Family } from '../families/schemas/family.schema';
import { PantryItem } from '../pantry/schemas/pantry-item.schema';
import { Recipe, RecipeDocument } from '../recipes/schemas/recipe.schema';

@Injectable()
export class MissingIngredientsService {
  constructor(
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(PantryItem.name)
    private readonly pantryItemModel: Model<PantryItem>,
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
  ) {}

  async getRecipeMissingIngredients(
    user: AuthenticatedUser,
    recipeId: string,
    servings?: number,
  ) {
    const familyId = await this.getActiveFamilyId(user);
    const recipe = await this.recipeModel.findById(recipeId).exec();

    if (!recipe || recipe.status === 'archived') {
      throw new NotFoundException('Recipe not found');
    }

    return this.calculateMissingIngredients(familyId, recipe, servings);
  }

  async calculateMissingIngredients(
    familyId: Types.ObjectId,
    recipe: RecipeDocument,
    servings = recipe.servings,
  ) {
    const pantryItems = await this.pantryItemModel
      .find({
        familyId,
        status: 'active',
        quantity: { $gt: 0 },
      })
      .lean()
      .exec();

    const scale = servings / recipe.servings;

    const ingredients = recipe.ingredients
      .filter((ingredient) => !ingredient.optional)
      .map((ingredient) => {
        const requiredQuantity = Number((ingredient.quantity * scale).toFixed(3));
        const availableQuantity = this.getAvailableQuantity(pantryItems, {
          foodId: ingredient.foodId?.toString(),
          name: ingredient.name,
          unit: ingredient.unit,
        });
        const missingQuantity = Math.max(
          0,
          Number((requiredQuantity - availableQuantity).toFixed(3)),
        );

        return {
          foodId: ingredient.foodId?.toString(),
          categoryId: ingredient.categoryId?.toString(),
          name: ingredient.name,
          unit: ingredient.unit,
          requiredQuantity,
          availableQuantity,
          missingQuantity,
          isMissing: missingQuantity > 0,
        };
      });

    return {
      recipeId: recipe._id.toString(),
      recipeName: recipe.name,
      servings,
      hasMissingIngredients: ingredients.some((item) => item.isMissing),
      ingredients,
      missingIngredients: ingredients.filter((item) => item.isMissing),
    };
  }

  private getAvailableQuantity(
    pantryItems: Array<{
      foodId?: Types.ObjectId;
      name: string;
      quantity: number;
      unit: string;
    }>,
    ingredient: { foodId?: string; name: string; unit: string },
  ) {
    return pantryItems
      .filter((item) => {
        const sameUnit = item.unit.toLowerCase() === ingredient.unit.toLowerCase();
        if (!sameUnit) {
          return false;
        }

        if (ingredient.foodId && item.foodId) {
          return item.foodId.toString() === ingredient.foodId;
        }

        return (
          item.name.trim().toLowerCase() === ingredient.name.trim().toLowerCase()
        );
      })
      .reduce((sum, item) => sum + item.quantity, 0);
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
}
