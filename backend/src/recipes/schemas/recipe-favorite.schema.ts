import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecipeFavoriteDocument = HydratedDocument<RecipeFavorite>;

@Schema({
  collection: 'recipeFavorites',
  timestamps: true,
})
export class RecipeFavorite {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Recipe', required: true })
  recipeId!: Types.ObjectId;
}

export const RecipeFavoriteSchema =
  SchemaFactory.createForClass(RecipeFavorite);

RecipeFavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
RecipeFavoriteSchema.index({ recipeId: 1 });
RecipeFavoriteSchema.index({ userId: 1, createdAt: -1 });
