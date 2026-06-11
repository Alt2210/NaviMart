import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FoodDocument = HydratedDocument<Food>;

export const FOOD_STATUSES = ['active', 'archived'] as const;
export const FOOD_STORAGE_LOCATIONS = [
  'freezer',
  'fridge',
  'pantry',
  'other',
] as const;

@Schema({
  collection: 'foods',
  timestamps: true,
})
export class Food {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name!: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 180,
  })
  normalizedName!: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 30 })
  defaultUnit!: string;

  @Prop({ type: [String], default: [] })
  aliases!: string[];

  @Prop({
    type: String,
    enum: FOOD_STORAGE_LOCATIONS,
    default: 'fridge',
  })
  defaultStorageLocation!: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @Prop({ type: Number, min: 0 })
  defaultShelfLifeDays?: number;

  @Prop({ type: String, trim: true, maxlength: 500 })
  storageTips?: string;

  @Prop({ type: String, trim: true })
  imageUrl?: string;

  @Prop({ type: Boolean, default: true })
  isSystem!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: String, enum: FOOD_STATUSES, default: 'active' })
  status!: (typeof FOOD_STATUSES)[number];
}

export const FoodSchema = SchemaFactory.createForClass(Food);

FoodSchema.index({ normalizedName: 1 }, { unique: true });
FoodSchema.index({ categoryId: 1, status: 1 });
FoodSchema.index({
  name: 'text',
  normalizedName: 'text',
  aliases: 'text',
});
