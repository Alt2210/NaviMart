import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InventoryEventDocument = HydratedDocument<InventoryEvent>;

export const INVENTORY_EVENT_TYPES = [
  'added',
  'adjusted',
  'consumed',
  'wasted',
  'deleted',
  'expired',
] as const;

export const INVENTORY_EVENT_SOURCES = [
  'manual',
  'shopping',
  'meal',
  'import',
  'system',
] as const;

@Schema({
  collection: 'inventoryEvents',
  timestamps: true,
})
export class InventoryEvent {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Family', required: true })
  familyId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PantryItem' })
  pantryItemId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Food' })
  foodId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name!: string;

  @Prop({ type: Number, required: true })
  quantityDelta!: number;

  @Prop({ type: Number, required: true, min: 0 })
  quantityAfter!: number;

  @Prop({ type: String, required: true, trim: true, maxlength: 30 })
  unit!: string;

  @Prop({ type: String, enum: INVENTORY_EVENT_TYPES, required: true })
  type!: (typeof INVENTORY_EVENT_TYPES)[number];

  @Prop({ type: String, enum: INVENTORY_EVENT_SOURCES, default: 'manual' })
  source!: (typeof INVENTORY_EVENT_SOURCES)[number];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: String, trim: true, maxlength: 300 })
  note?: string;
}

export const InventoryEventSchema =
  SchemaFactory.createForClass(InventoryEvent);

InventoryEventSchema.index({ familyId: 1, createdAt: -1 });
InventoryEventSchema.index({ familyId: 1, type: 1, createdAt: -1 });
InventoryEventSchema.index({ familyId: 1, foodId: 1, createdAt: -1 });
InventoryEventSchema.index({ pantryItemId: 1, createdAt: -1 });
