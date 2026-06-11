import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Family } from '../families/schemas/family.schema';
import {
  Recipe,
  RECIPE_STATUSES,
} from '../recipes/schemas/recipe.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>,
  ) {}

  async getStats() {
    const [totalUsers, activeUsers, totalFamilies, recipeStatusCounts] =
      await Promise.all([
        this.userModel.countDocuments().exec(),
        this.userModel.countDocuments({ status: 'active' }).exec(),
        this.familyModel.countDocuments().exec(),
        this.recipeModel.aggregate<{ _id: string; count: number }>([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    const recipesByStatus = Object.fromEntries(
      RECIPE_STATUSES.map((status) => [status, 0]),
    ) as Record<(typeof RECIPE_STATUSES)[number], number>;
    let totalRecipes = 0;

    for (const row of recipeStatusCounts) {
      recipesByStatus[row._id as (typeof RECIPE_STATUSES)[number]] = row.count;
      totalRecipes += row.count;
    }

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      recipes: {
        total: totalRecipes,
        byStatus: recipesByStatus,
      },
      families: {
        total: totalFamilies,
      },
    };
  }
}
