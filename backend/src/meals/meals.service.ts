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
import { Recipe } from '../recipes/schemas/recipe.schema';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { ListMealPlansQueryDto } from './dto/list-meal-plans-query.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { MissingIngredientsService } from './missing-ingredients.service';
import { MealPlan, MealPlanDocument } from './schemas/meal-plan.schema';
import { ShoppingListGenerationService } from './shopping-list-generation.service';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(MealPlan.name) private readonly mealPlanModel: Model<MealPlan>,
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
    private readonly missingIngredientsService: MissingIngredientsService,
    private readonly shoppingListGenerationService: ShoppingListGenerationService,
  ) {}

  async findAll(user: AuthenticatedUser, query: ListMealPlansQueryDto) {
    const familyId = await this.getActiveFamilyId(user);
    const filter: Record<string, unknown> = {
      familyId,
      date: {
        $gte: query.startDate,
        $lte: query.endDate,
      },
    };

    if (query.session) {
      filter.session = query.session;
    }

    const meals = await this.mealPlanModel
      .find(filter)
      .sort({ date: 1, session: 1 })
      .exec();

    return meals.map((meal) => this.toMealPlanResponse(meal));
  }

  async create(user: AuthenticatedUser, dto: CreateMealPlanDto) {
    const familyId = await this.getActiveFamilyId(user);
    const recipe = dto.recipeId ? await this.getRecipe(dto.recipeId) : undefined;

    const meal = await this.mealPlanModel.create({
      familyId,
      date: dto.date,
      session: dto.session,
      customSessionName: dto.customSessionName,
      recipeId: recipe?._id,
      customName: dto.customName,
      servings: dto.servings ?? recipe?.servings ?? 1,
      isCompleted: dto.isCompleted ?? false,
      note: dto.note,
      createdBy: new Types.ObjectId(user.userId),
    });

    return this.toMealPlanResponse(meal);
  }

  async findOne(user: AuthenticatedUser, mealId: string) {
    const meal = await this.findMealForUser(user, mealId);
    return this.toMealPlanResponse(meal);
  }

  async update(user: AuthenticatedUser, mealId: string, dto: UpdateMealPlanDto) {
    const meal = await this.findMealForUser(user, mealId);
    const recipe = dto.recipeId ? await this.getRecipe(dto.recipeId) : undefined;

    if (dto.date !== undefined) meal.date = dto.date;
    if (dto.session !== undefined) meal.session = dto.session;
    if (dto.customSessionName !== undefined) {
      meal.customSessionName = dto.customSessionName;
    }
    if (dto.recipeId !== undefined) {
      meal.recipeId = recipe?._id;
      if (!dto.servings && recipe) {
        meal.servings = recipe.servings;
      }
    }
    if (dto.customName !== undefined) meal.customName = dto.customName;
    if (dto.servings !== undefined) meal.servings = dto.servings;
    if (dto.isCompleted !== undefined) meal.isCompleted = dto.isCompleted;
    if (dto.note !== undefined) meal.note = dto.note;

    await meal.save();
    return this.toMealPlanResponse(meal);
  }

  async remove(user: AuthenticatedUser, mealId: string) {
    const meal = await this.findMealForUser(user, mealId);
    await meal.deleteOne();

    return { success: true };
  }

  async getMissingIngredients(user: AuthenticatedUser, mealId: string) {
    const meal = await this.findMealForUser(user, mealId);

    if (!meal.recipeId) {
      throw new BadRequestException('Meal plan does not have a recipe');
    }

    return this.missingIngredientsService.getRecipeMissingIngredients(
      user,
      meal.recipeId.toString(),
      meal.servings,
    );
  }

  async generateShoppingList(
    user: AuthenticatedUser,
    mealId: string,
    dto: GenerateShoppingListDto,
  ) {
    const meal = await this.findMealForUser(user, mealId);

    if (!meal.recipeId) {
      throw new BadRequestException('Meal plan does not have a recipe');
    }

    return this.shoppingListGenerationService.generateFromMeal(
      user,
      meal.recipeId.toString(),
      meal.servings,
      {
        name: dto.name,
        plannedFor: dto.plannedFor ?? meal.date,
      },
    );
  }

  private async findMealForUser(user: AuthenticatedUser, mealId: string) {
    const familyId = await this.getActiveFamilyId(user);
    const meal = await this.mealPlanModel
      .findOne({ _id: mealId, familyId })
      .exec();

    if (!meal) {
      throw new NotFoundException('Meal plan not found');
    }

    return meal;
  }

  private async getRecipe(recipeId: string) {
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

  private toMealPlanResponse(meal: MealPlanDocument | MealPlan) {
    return {
      id: meal._id.toString(),
      familyId: meal.familyId.toString(),
      date: meal.date,
      session: meal.session,
      customSessionName: meal.customSessionName,
      recipeId: meal.recipeId?.toString(),
      customName: meal.customName,
      servings: meal.servings,
      isCompleted: meal.isCompleted,
      note: meal.note,
      createdBy: meal.createdBy.toString(),
    };
  }
}
