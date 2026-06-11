import { Types } from 'mongoose';
import { USER_ROLES } from '../../users/schemas/user.schema';

export type AuthenticatedUser = {
  userId: string;
  email?: string;
  phone?: string;
  role: (typeof USER_ROLES)[number];
  activeFamilyId?: string;
};

export type JwtPayload = {
  sub: string;
  email?: string;
  phone?: string;
  role: (typeof USER_ROLES)[number];
  activeFamilyId?: string;
};

export function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}
