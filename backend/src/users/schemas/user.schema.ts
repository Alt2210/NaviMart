import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export const USER_ROLES = ['admin', 'housewife', 'member'] as const;
export const USER_STATUSES = ['active', 'banned', 'inactive'] as const;
export const USER_GENDERS = ['male', 'female', 'other', 'unspecified'] as const;

@Schema({ _id: false })
export class UserNotificationSettings {
  @Prop({ type: Boolean, default: true })
  expiryReminder!: boolean;

  @Prop({ type: Number, default: 3, min: 0, max: 30 })
  expiryReminderDays!: number;

  @Prop({ type: Boolean, default: true })
  shoppingReminder!: boolean;
}

export const UserNotificationSettingsSchema = SchemaFactory.createForClass(
  UserNotificationSettings,
);

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  _id!: Types.ObjectId;

  @Prop({ type: String, trim: true, lowercase: true })
  email?: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 80 })
  firstName!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 80 })
  lastName!: string;

  @Prop({ type: String, trim: true, maxlength: 160 })
  displayName?: string;

  @Prop({ type: String, trim: true })
  avatarUrl?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, enum: USER_GENDERS, default: 'unspecified' })
  gender!: (typeof USER_GENDERS)[number];

  @Prop({ type: String, enum: USER_ROLES, default: 'member' })
  role!: (typeof USER_ROLES)[number];

  @Prop({ type: String, enum: USER_STATUSES, default: 'active' })
  status!: (typeof USER_STATUSES)[number];

  @Prop({ type: Types.ObjectId, ref: 'Family' })
  activeFamilyId?: Types.ObjectId;

  @Prop({
    type: UserNotificationSettingsSchema,
    default: () => ({}),
  })
  notificationSettings!: UserNotificationSettings;

  @Prop({ type: String, select: false })
  refreshTokenHash?: string;

  @Prop({ type: String, select: false })
  resetPasswordTokenHash?: string;

  @Prop({ type: Date, select: false })
  resetPasswordExpiresAt?: Date;

  @Prop({ type: String, select: false })
  emailVerificationTokenHash?: string;

  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ activeFamilyId: 1 });
UserSchema.index({ status: 1 });
