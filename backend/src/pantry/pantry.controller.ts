import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ConsumePantryItemDto } from './dto/consume-pantry-item.dto';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { ListPantryItemsQueryDto } from './dto/list-pantry-items-query.dto';
import { UpdatePantryItemDto } from './dto/update-pantry-item.dto';
import { PantryService } from './pantry.service';

@ApiTags('Pantry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get()
  @ApiOkResponse({ description: 'Pantry items for current family.' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListPantryItemsQueryDto,
  ) {
    return this.pantryService.findAll(user, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_pantry')
  @ApiCreatedResponse({ description: 'Pantry item created.' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createPantryItemDto: CreatePantryItemDto,
  ) {
    return this.pantryService.create(user, createPantryItemDto);
  }

  @Get(':itemId')
  @ApiOkResponse({ description: 'Pantry item detail.' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
  ) {
    return this.pantryService.findOne(user, itemId);
  }

  @Patch(':itemId')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_pantry')
  @ApiOkResponse({ description: 'Pantry item updated.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
    @Body() updatePantryItemDto: UpdatePantryItemDto,
  ) {
    return this.pantryService.update(user, itemId, updatePantryItemDto);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_pantry')
  @ApiOkResponse({ description: 'Pantry item deleted.' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
  ) {
    return this.pantryService.remove(user, itemId);
  }

  @Post(':itemId/consume')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_pantry')
  @ApiOkResponse({ description: 'Pantry item quantity consumed.' })
  consume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
    @Body() consumePantryItemDto: ConsumePantryItemDto,
  ) {
    return this.pantryService.consume(user, itemId, consumePantryItemDto);
  }

  @Post(':itemId/waste')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FamilyPermissionGuard)
  @FamilyPermissions('edit_pantry')
  @ApiOkResponse({ description: 'Pantry item marked as wasted.' })
  markWasted(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
  ) {
    return this.pantryService.markWasted(user, itemId);
  }
}
