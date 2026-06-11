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
import { FamilyPermissions } from '../auth/decorators/family-permissions.decorator';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { ListMealPlansQueryDto } from './dto/list-meal-plans-query.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { MealsService } from './meals.service';

@ApiTags('Meals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @ApiOkResponse({ description: 'Meal plans in date range.' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListMealPlansQueryDto,
  ) {
    return this.mealsService.findAll(user, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_meals')
  @ApiCreatedResponse({ description: 'Meal plan created.' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createMealPlanDto: CreateMealPlanDto,
  ) {
    return this.mealsService.create(user, createMealPlanDto);
  }

  @Get(':mealId')
  @ApiOkResponse({ description: 'Meal plan detail.' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('mealId') mealId: string,
  ) {
    return this.mealsService.findOne(user, mealId);
  }

  @Get(':mealId/missing-ingredients')
  @ApiOkResponse({ description: 'Missing ingredients for meal recipe.' })
  getMissingIngredients(
    @CurrentUser() user: AuthenticatedUser,
    @Param('mealId') mealId: string,
  ) {
    return this.mealsService.getMissingIngredients(user, mealId);
  }

  @Post(':mealId/generate-shopping-list')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_lists')
  @ApiCreatedResponse({
    description: 'Shopping list generated from missing meal ingredients.',
  })
  generateShoppingList(
    @CurrentUser() user: AuthenticatedUser,
    @Param('mealId') mealId: string,
    @Body() generateShoppingListDto: GenerateShoppingListDto,
  ) {
    return this.mealsService.generateShoppingList(
      user,
      mealId,
      generateShoppingListDto,
    );
  }

  @Patch(':mealId')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_meals')
  @ApiOkResponse({ description: 'Meal plan updated.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('mealId') mealId: string,
    @Body() updateMealPlanDto: UpdateMealPlanDto,
  ) {
    return this.mealsService.update(user, mealId, updateMealPlanDto);
  }

  @Delete(':mealId')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_meals')
  @ApiOkResponse({ description: 'Meal plan deleted.' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('mealId') mealId: string,
  ) {
    return this.mealsService.remove(user, mealId);
  }
}
