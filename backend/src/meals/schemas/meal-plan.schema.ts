import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MealPlanDocument = HydratedDocument<MealPlan>;

export const MEAL_SESSIONS = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'custom',
] as const;

@Schema({
  collection: 'mealPlans',
  timestamps: true,
})
export class MealPlan {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Family', required: true })
  familyId!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date!: Date;

  @Prop({ type: String, enum: MEAL_SESSIONS, required: true })
  session!: (typeof MEAL_SESSIONS)[number];

  @Prop({ type: String, trim: true, maxlength: 80 })
  customSessionName?: string;

  @Prop({ type: Types.ObjectId, ref: 'Recipe' })
  recipeId?: Types.ObjectId;

  @Prop({ type: String, trim: true, maxlength: 200 })
  customName?: string;

  @Prop({ type: Number, default: 1, min: 1 })
  servings!: number;

  @Prop({ type: Boolean, default: false })
  isCompleted!: boolean;

  @Prop({ type: String, trim: true, maxlength: 300 })
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;
}

export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);

MealPlanSchema.index({ familyId: 1, date: 1, session: 1 });
MealPlanSchema.index({ familyId: 1, recipeId: 1 });
