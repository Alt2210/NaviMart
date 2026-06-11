import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';

export type PantryItemDocument = HydratedDocument<PantryItem>;

export const PANTRY_ITEM_STATUSES = [
  'active',
  'used_up',
  'wasted',
  'expired',
] as const;
export const PANTRY_ITEM_SOURCES = [
  'manual',
  'shopping',
  'meal',
  'import',
] as const;

@Schema({
  collection: 'pantryItems',
  timestamps: true,
})
export class PantryItem {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Family', required: true })
  familyId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Food' })
  foodId?: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  quantity!: number;

  @Prop({ type: String, required: true, trim: true, maxlength: 30 })
  unit!: string;

  @Prop({ type: Date, required: true })
  expiryDate!: Date;

  @Prop({ type: String, enum: FOOD_STORAGE_LOCATIONS, default: 'fridge' })
  location!: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @Prop({ type: String, enum: PANTRY_ITEM_STATUSES, default: 'active' })
  status!: (typeof PANTRY_ITEM_STATUSES)[number];

  @Prop({ type: String, enum: PANTRY_ITEM_SOURCES, default: 'manual' })
  source!: (typeof PANTRY_ITEM_SOURCES)[number];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;

  @Prop({ type: String, trim: true, maxlength: 300 })
  note?: string;

  @Prop({ type: Date })
  consumedAt?: Date;

  @Prop({ type: Date })
  wastedAt?: Date;
}

export const PantryItemSchema = SchemaFactory.createForClass(PantryItem);

PantryItemSchema.index({ familyId: 1, status: 1, expiryDate: 1 });
PantryItemSchema.index({ familyId: 1, location: 1 });
PantryItemSchema.index({ familyId: 1, categoryId: 1 });
PantryItemSchema.index({ familyId: 1, foodId: 1 });
