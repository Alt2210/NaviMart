import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { FamilyPermissions } from '../auth/decorators/family-permissions.decorator';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { GenerateShoppingListDto } from '../meals/dto/generate-shopping-list.dto';
import { MissingIngredientsQueryDto } from '../meals/dto/missing-ingredients-query.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ListRecipesQueryDto } from './dto/list-recipes-query.dto';
import { RecipeSuggestionsQueryDto } from './dto/recipe-suggestions-query.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOkResponse({ description: 'Recipe search results.' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListRecipesQueryDto,
  ) {
    return this.recipesService.findAll(user, query);
  }

  @Get('suggestions')
  @ApiOkResponse({
    description: 'Recipe suggestions ranked by pantry ingredient match.',
  })
  getSuggestions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: RecipeSuggestionsQueryDto,
  ) {
    return this.recipesService.getSuggestions(user, query);
  }

  @Get('favorites')
  @ApiOkResponse({ description: 'Current user favorite recipes.' })
  findFavorites(@CurrentUser() user: AuthenticatedUser) {
    return this.recipesService.findFavorites(user);
  }

  @Get(':recipeId')
  @ApiOkResponse({ description: 'Recipe detail.' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipesService.findOne(user, recipeId);
  }

  @Post(':recipeId/favorite')
  @ApiCreatedResponse({ description: 'Recipe added to favorites.' })
  addFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipesService.addFavorite(user, recipeId);
  }

  @Delete(':recipeId/favorite')
  @ApiOkResponse({ description: 'Recipe removed from favorites.' })
  removeFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipesService.removeFavorite(user, recipeId);
  }

  @Get(':recipeId/missing-ingredients')
  @ApiOkResponse({ description: 'Missing ingredients compared with pantry.' })
  getMissingIngredients(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Query() query: MissingIngredientsQueryDto,
  ) {
    return this.recipesService.getMissingIngredients(
      user,
      recipeId,
      query.servings,
    );
  }

  @Post(':recipeId/generate-shopping-list')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_lists')
  @ApiCreatedResponse({
    description: 'Shopping list generated from missing recipe ingredients.',
  })
  generateShoppingList(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Body() generateShoppingListDto: GenerateShoppingListDto,
  ) {
    return this.recipesService.generateShoppingList(
      user,
      recipeId,
      generateShoppingListDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'housewife')
  @ApiCreatedResponse({ description: 'Recipe created.' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(user, createRecipeDto);
  }

  @Patch(':recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'housewife')
  @ApiOkResponse({ description: 'Recipe updated.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(user, recipeId, updateRecipeDto);
  }

  @Delete(':recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'housewife')
  @ApiOkResponse({ description: 'Recipe archived.' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipesService.remove(user, recipeId);
  }
}
