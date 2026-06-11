import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryEventsService } from './inventory-events.service';
import {
  InventoryEvent,
  InventoryEventSchema,
} from './schemas/inventory-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryEvent.name, schema: InventoryEventSchema },
    ]),
  ],
  providers: [InventoryEventsService],
  exports: [InventoryEventsService, MongooseModule],
})
export class InventoryEventsModule {}
