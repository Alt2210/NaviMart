import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Category } from '../catalog/schemas/category.schema';
import { Food } from '../catalog/schemas/food.schema';
import { MissingIngredientsService } from '../meals/missing-ingredients.service';
import { GenerateShoppingListDto } from '../meals/dto/generate-shopping-list.dto';
import { ShoppingListGenerationService } from '../meals/shopping-list-generation.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ListRecipesQueryDto } from './dto/list-recipes-query.dto';
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe, RecipeDocument, RecipeIngredient } from './schemas/recipe.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
    @InjectModel(Food.name) private readonly foodModel: Model<Food>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly missingIngredientsService: MissingIngredientsService,
    private readonly shoppingListGenerationService: ShoppingListGenerationService,
  ) {}

  async findAll(query: ListRecipesQueryDto) {
    const filter = this.buildRecipeFilter(query);
    const recipes = await this.recipeModel
      .find(filter)
      .sort(query.q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(query.limit ?? 30)
      .exec();

    return recipes.map((recipe) => this.toRecipeSummary(recipe));
  }

  async findOne(recipeId: string) {
    const recipe = await this.recipeModel.findById(recipeId).exec();

    if (!recipe || recipe.status === 'archived') {
      throw new NotFoundException('Recipe not found');
    }

    return this.toRecipeDetail(recipe);
  }

  async create(user: AuthenticatedUser, dto: CreateRecipeDto) {
    const ingredients = await this.buildIngredients(dto.ingredients);
    const recipe = await this.recipeModel.create({
      name: dto.name,
      normalizedName: this.normalizeName(dto.name),
      description: dto.description,
      imageUrl: dto.imageUrl,
      cookTimeMinutes: dto.cookTimeMinutes,
      difficulty: dto.difficulty ?? 'easy',
      servings: dto.servings ?? 1,
      ingredients,
      steps: dto.steps,
      nutrition: dto.nutrition ?? {},
      tags: dto.tags ?? [],
      authorId: new Types.ObjectId(user.userId),
      status: dto.status ?? (user.role === 'admin' ? 'approved' : 'pending'),
    });

    return this.toRecipeDetail(recipe);
  }

  async update(user: AuthenticatedUser, recipeId: string, dto: UpdateRecipeDto) {
    const recipe = await this.recipeModel.findById(recipeId).exec();

    if (!recipe || recipe.status === 'archived') {
      throw new NotFoundException('Recipe not found');
    }

    if (user.role !== 'admin' && recipe.authorId?.toString() !== user.userId) {
      throw new ForbiddenException('Cannot update this recipe');
    }

    if (dto.name !== undefined) {
      recipe.name = dto.name;
      recipe.normalizedName = this.normalizeName(dto.name);
    }
    if (dto.description !== undefined) recipe.description = dto.description;
    if (dto.imageUrl !== undefined) recipe.imageUrl = dto.imageUrl;
    if (dto.cookTimeMinutes !== undefined) {
      recipe.cookTimeMinutes = dto.cookTimeMinutes;
    }
    if (dto.difficulty !== undefined) recipe.difficulty = dto.difficulty;
    if (dto.servings !== undefined) recipe.servings = dto.servings;
    if (dto.ingredients !== undefined) {
      recipe.ingredients = (await this.buildIngredients(
        dto.ingredients,
      )) as RecipeIngredient[];
    }
    if (dto.steps !== undefined) recipe.steps = dto.steps;
    if (dto.nutrition !== undefined) recipe.nutrition = dto.nutrition;
    if (dto.tags !== undefined) recipe.tags = dto.tags;
    if (dto.status !== undefined) {
      if (user.role !== 'admin') {
        throw new ForbiddenException('Only admin can update recipe status');
      }
      recipe.status = dto.status;
    }

    await recipe.save();
    return this.toRecipeDetail(recipe);
  }

  async remove(user: AuthenticatedUser, recipeId: string) {
    const recipe = await this.recipeModel.findById(recipeId).exec();

    if (!recipe || recipe.status === 'archived') {
      throw new NotFoundException('Recipe not found');
    }

    if (user.role !== 'admin' && recipe.authorId?.toString() !== user.userId) {
      throw new ForbiddenException('Cannot delete this recipe');
    }

    recipe.status = 'archived';
    await recipe.save();

    return { success: true };
  }

  async getMissingIngredients(
    user: AuthenticatedUser,
    recipeId: string,
    servings?: number,
  ) {
    return this.missingIngredientsService.getRecipeMissingIngredients(
      user,
      recipeId,
      servings,
    );
  }

  async generateShoppingList(
    user: AuthenticatedUser,
    recipeId: string,
    dto: GenerateShoppingListDto,
  ) {
    return this.shoppingListGenerationService.generateFromRecipe(
      user,
      recipeId,
      dto,
    );
  }

  private buildRecipeFilter(query: ListRecipesQueryDto) {
    const filter: Record<string, unknown> = {
      status: query.status ?? 'approved',
    };

    if (query.q) {
      filter.$text = { $search: query.q.trim() };
    }
    if (query.ingredient) {
      filter['ingredients.name'] = {
        $regex: query.ingredient.trim(),
        $options: 'i',
      };
    }
    if (query.categoryId) {
      filter['ingredients.categoryId'] = new Types.ObjectId(query.categoryId);
    }
    if (query.difficulty) {
      filter.difficulty = query.difficulty;
    }
    if (query.maxCookTime) {
      filter.cookTimeMinutes = { $lte: query.maxCookTime };
    }

    return filter;
  }

  private async buildIngredients(ingredients: RecipeIngredientDto[]) {
    return Promise.all(
      ingredients.map(async (ingredient) => {
        if (ingredient.foodId) {
          const food = await this.getFood(ingredient.foodId);
          return {
            foodId: food._id,
            name: food.name,
            categoryId: ingredient.categoryId
              ? new Types.ObjectId(ingredient.categoryId)
              : food.categoryId,
            quantity: ingredient.quantity,
            unit: ingredient.unit ?? food.defaultUnit,
            optional: ingredient.optional ?? false,
          };
        }

        if (ingredient.categoryId) {
          await this.assertCategoryExists(ingredient.categoryId);
        }

        return {
          name: ingredient.name!,
          categoryId: ingredient.categoryId
            ? new Types.ObjectId(ingredient.categoryId)
            : undefined,
          quantity: ingredient.quantity,
          unit: ingredient.unit!,
          optional: ingredient.optional ?? false,
        };
      }),
    );
  }

  private async getFood(foodId: string) {
    const food = await this.foodModel
      .findOne({ _id: foodId, status: 'active' })
      .exec();

    if (!food) {
      throw new NotFoundException('Food catalog item not found');
    }

    return food;
  }

  private async assertCategoryExists(categoryId: string) {
    const exists = await this.categoryModel
      .exists({ _id: categoryId, status: 'active' })
      .exec();

    if (!exists) {
      throw new NotFoundException('Category not found');
    }
  }

  private normalizeName(name: string) {
    return name.trim().toLowerCase();
  }

  private toRecipeSummary(recipe: RecipeDocument | Recipe) {
    return {
      id: recipe._id.toString(),
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      cookTimeMinutes: recipe.cookTimeMinutes,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      status: recipe.status,
      tags: recipe.tags,
      ingredientCount: recipe.ingredients.length,
    };
  }

  private toRecipeDetail(recipe: RecipeDocument | Recipe) {
    return {
      ...this.toRecipeSummary(recipe),
      authorId: recipe.authorId?.toString(),
      ingredients: recipe.ingredients.map((ingredient) => ({
        foodId: ingredient.foodId?.toString(),
        categoryId: ingredient.categoryId?.toString(),
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        optional: ingredient.optional,
      })),
      steps: recipe.steps,
      nutrition: recipe.nutrition,
    };
  }
}
