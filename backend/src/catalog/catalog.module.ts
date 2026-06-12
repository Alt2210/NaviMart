import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Food, FoodSchema } from './schemas/food.schema';
import { Unit, UnitSchema } from './schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Food.name, schema: FoodSchema },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [MongooseModule],
})
export class CatalogModule {}
