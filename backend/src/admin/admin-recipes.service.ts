import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../recipes/schemas/recipe.schema';
import { ListAdminRecipesQueryDto } from './dto/list-admin-recipes-query.dto';
import { UpdateRecipeStatusDto } from './dto/update-recipe-status.dto';

@Injectable()
export class AdminRecipesService {
  constructor(
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
  ) {}

  async findAll(query: ListAdminRecipesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = { status: query.status ?? 'pending' };

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.recipeModel.countDocuments(filter).exec(),
    ]);

    return {
      items: recipes.map((recipe) => this.toModerationSummary(recipe)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(recipeId: string, dto: UpdateRecipeStatusDto) {
    const recipe = await this.recipeModel.findById(recipeId).exec();

    if (!recipe || recipe.status === 'archived') {
      throw new NotFoundException('Recipe not found');
    }

    recipe.status = dto.status;
    if (dto.note !== undefined) {
      recipe.moderationNote = dto.note;
    }

    await recipe.save();
    return this.toModerationSummary(recipe);
  }

  private toModerationSummary(recipe: RecipeDocument) {
    return {
      id: recipe._id.toString(),
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      cookTimeMinutes: recipe.cookTimeMinutes,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      status: recipe.status,
      moderationNote: recipe.moderationNote,
      tags: recipe.tags,
      ingredientCount: recipe.ingredients.length,
      favoritesCount: recipe.favoritesCount ?? 0,
      authorId: recipe.authorId?.toString(),
    };
  }
}
