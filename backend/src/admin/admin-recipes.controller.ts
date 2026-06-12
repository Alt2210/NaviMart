import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminRecipesService } from './admin-recipes.service';
import { ListAdminRecipesQueryDto } from './dto/list-admin-recipes-query.dto';
import { UpdateRecipeStatusDto } from './dto/update-recipe-status.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/recipes')
export class AdminRecipesController {
  constructor(private readonly adminRecipesService: AdminRecipesService) {}

  @Get()
  @ApiOkResponse({ description: 'Paginated recipe moderation list.' })
  findAll(@Query() query: ListAdminRecipesQueryDto) {
    return this.adminRecipesService.findAll(query);
  }

  @Patch(':recipeId/status')
  @ApiOkResponse({ description: 'Recipe moderation status updated.' })
  updateStatus(
    @Param('recipeId') recipeId: string,
    @Body() updateRecipeStatusDto: UpdateRecipeStatusDto,
  ) {
    return this.adminRecipesService.updateStatus(
      recipeId,
      updateRecipeStatusDto,
    );
  }
}
