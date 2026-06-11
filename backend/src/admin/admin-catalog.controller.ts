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
import { AdminCatalogService } from './admin-catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { ListCatalogQueryDto } from './dto/list-catalog-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/catalog')
export class AdminCatalogController {
  constructor(private readonly adminCatalogService: AdminCatalogService) {}

  @Get('categories')
  @ApiOkResponse({ description: 'Catalog categories.' })
  findAllCategories(@Query() query: ListCatalogQueryDto) {
    return this.adminCatalogService.findAllCategories(query);
  }

  @Post('categories')
  @ApiCreatedResponse({ description: 'Category created.' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminCatalogService.createCategory(createCategoryDto);
  }

  @Patch('categories/:categoryId')
  @ApiOkResponse({ description: 'Category updated.' })
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.adminCatalogService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete('categories/:categoryId')
  @ApiOkResponse({ description: 'Category archived.' })
  removeCategory(@Param('categoryId') categoryId: string) {
    return this.adminCatalogService.removeCategory(categoryId);
  }

  @Get('foods')
  @ApiOkResponse({ description: 'Catalog foods.' })
  findAllFoods(@Query() query: ListCatalogQueryDto) {
    return this.adminCatalogService.findAllFoods(query);
  }

  @Post('foods')
  @ApiCreatedResponse({ description: 'Food created.' })
  createFood(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    return this.adminCatalogService.createFood(user, createFoodDto);
  }

  @Patch('foods/:foodId')
  @ApiOkResponse({ description: 'Food updated.' })
  updateFood(
    @Param('foodId') foodId: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    return this.adminCatalogService.updateFood(foodId, updateFoodDto);
  }

  @Delete('foods/:foodId')
  @ApiOkResponse({ description: 'Food archived.' })
  removeFood(@Param('foodId') foodId: string) {
    return this.adminCatalogService.removeFood(foodId);
  }

  @Get('units')
  @ApiOkResponse({ description: 'Catalog units.' })
  findAllUnits(@Query() query: ListCatalogQueryDto) {
    return this.adminCatalogService.findAllUnits(query);
  }

  @Post('units')
  @ApiCreatedResponse({ description: 'Unit created.' })
  createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.adminCatalogService.createUnit(createUnitDto);
  }

  @Patch('units/:unitId')
  @ApiOkResponse({ description: 'Unit updated.' })
  updateUnit(
    @Param('unitId') unitId: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.adminCatalogService.updateUnit(unitId, updateUnitDto);
  }

  @Delete('units/:unitId')
  @ApiOkResponse({ description: 'Unit archived.' })
  removeUnit(@Param('unitId') unitId: string) {
    return this.adminCatalogService.removeUnit(unitId);
  }
}
