import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from '../families/schemas/family.schema';
import {
  PantryItem,
  PantryItemSchema,
} from '../pantry/schemas/pantry-item.schema';
import { AiChefController } from './ai-chef.controller';
import { AiChefService } from './ai-chef.service';
import { TimelyService } from './timely.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Family.name, schema: FamilySchema },
      { name: PantryItem.name, schema: PantryItemSchema },
    ]),
  ],
  controllers: [AiChefController],
  providers: [AiChefService, TimelyService],
})
export class AiChefModule {}
