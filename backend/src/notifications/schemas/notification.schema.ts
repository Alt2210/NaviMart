import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export const NOTIFICATION_TYPES = [
  'pantry_expiring',
  'pantry_expired',
  'shopping_reminder',
] as const;

@Schema({
  collection: 'notifications',
  timestamps: true,
})
export class Notification {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Family' })
  familyId?: Types.ObjectId;

  @Prop({ type: String, enum: NOTIFICATION_TYPES, required: true })
  type!: (typeof NOTIFICATION_TYPES)[number];

  @Prop({ type: String, required: true, trim: true, maxlength: 160 })
  title!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 500 })
  body!: string;

  @Prop({ type: Object, default: {} })
  data!: Record<string, unknown>;

  @Prop({ type: String, required: true })
  dedupeKey!: string;

  @Prop({ type: Date })
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
NotificationSchema.index({ familyId: 1, createdAt: -1 });
NotificationSchema.index({ dedupeKey: 1 }, { unique: true });
