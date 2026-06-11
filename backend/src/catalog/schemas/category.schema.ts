import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export const CATEGORY_STATUSES = ['active', 'archived'] as const;

@Schema({
  collection: 'categories',
  timestamps: true,
})
export class Category {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  name!: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 120,
  })
  slug!: string;

  @Prop({ type: String, trim: true, maxlength: 300 })
  description?: string;

  @Prop({ type: String, trim: true, maxlength: 32 })
  icon?: string;

  @Prop({ type: String, enum: CATEGORY_STATUSES, default: 'active' })
  status!: (typeof CATEGORY_STATUSES)[number];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 'text', slug: 'text' });
CategorySchema.index({ status: 1 });
