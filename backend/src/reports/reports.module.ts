import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { Family, FamilySchema } from '../families/schemas/family.schema';
import {
  InventoryEvent,
  InventoryEventSchema,
} from '../inventory-events/schemas/inventory-event.schema';
import { PantryItem, PantryItemSchema } from '../pantry/schemas/pantry-item.schema';
import {
  ShoppingList,
  ShoppingListSchema,
} from '../shopping-lists/schemas/shopping-list.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Family.name, schema: FamilySchema },
      { name: ShoppingList.name, schema: ShoppingListSchema },
      { name: PantryItem.name, schema: PantryItemSchema },
      { name: InventoryEvent.name, schema: InventoryEventSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, FamilyPermissionGuard],
})
export class ReportsModule {}
