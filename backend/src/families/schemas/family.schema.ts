import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FamilyDocument = HydratedDocument<Family>;

export const FAMILY_MEMBER_ROLES = ['owner', 'admin', 'member'] as const;
export const FAMILY_MEMBER_STATUSES = ['active', 'removed', 'left'] as const;
export const FAMILY_PERMISSIONS = [
  'manage_family',
  'edit_pantry',
  'edit_lists',
  'edit_meals',
  'view_reports',
] as const;

@Schema({ _id: false })
export class FamilyMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: FAMILY_MEMBER_ROLES, default: 'member' })
  role!: (typeof FAMILY_MEMBER_ROLES)[number];

  @Prop({ type: [String], enum: FAMILY_PERMISSIONS, default: [] })
  permissions!: Array<(typeof FAMILY_PERMISSIONS)[number]>;

  @Prop({ type: String, enum: FAMILY_MEMBER_STATUSES, default: 'active' })
  status!: (typeof FAMILY_MEMBER_STATUSES)[number];

  @Prop({ type: Date, default: Date.now })
  joinedAt!: Date;
}

export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);

@Schema({ _id: false })
export class FamilyInviteCode {
  @Prop({ type: String, required: true })
  codeHash!: string;

  @Prop({ type: [String], enum: FAMILY_PERMISSIONS, default: [] })
  permissions!: Array<(typeof FAMILY_PERMISSIONS)[number]>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date })
  usedAt?: Date;
}

export const FamilyInviteCodeSchema =
  SchemaFactory.createForClass(FamilyInviteCode);

@Schema({
  collection: 'families',
  timestamps: true,
})
export class Family {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: [FamilyMemberSchema], default: [] })
  members!: FamilyMember[];

  @Prop({ type: [FamilyInviteCodeSchema], default: [] })
  inviteCodes!: FamilyInviteCode[];
}

export const FamilySchema = SchemaFactory.createForClass(Family);

FamilySchema.index({ ownerId: 1 });
FamilySchema.index({ 'members.userId': 1 });
FamilySchema.index({ 'inviteCodes.codeHash': 1 }, { sparse: true });
FamilySchema.index({ 'inviteCodes.expiresAt': 1 });
