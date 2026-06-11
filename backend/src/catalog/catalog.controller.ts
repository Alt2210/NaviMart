import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogService } from './catalog.service';
import { ListFoodsQueryDto } from './dto/list-foods-query.dto';

@ApiTags('Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  @ApiOkResponse({ description: 'Active catalog categories.' })
  findAllCategories() {
    return this.catalogService.findAllCategories();
  }

  @Get('foods')
  @ApiOkResponse({ description: 'Active catalog foods.' })
  findAllFoods(@Query() query: ListFoodsQueryDto) {
    return this.catalogService.findAllFoods(query);
  }

  @Get('units')
  @ApiOkResponse({ description: 'Active catalog units.' })
  findAllUnits() {
    return this.catalogService.findAllUnits();
  }
}
