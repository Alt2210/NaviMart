import { ForbiddenException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Family } from './schemas/family.schema';

/**
 * Resolves the caller's active family id, asserting they are an active member.
 * Single source of truth — previously copy-pasted across 8 services, which
 * risked the membership rule drifting between features.
 */
export async function resolveActiveFamilyId(
  familyModel: Model<Family>,
  user: AuthenticatedUser,
): Promise<Types.ObjectId> {
  if (!user.activeFamilyId) {
    throw new ForbiddenException('User is not attached to a family');
  }

  const family = await familyModel
    .findById(user.activeFamilyId)
    .select('_id members')
    .lean()
    .exec();

  const member = family?.members.find(
    (item) =>
      item.userId.toString() === user.userId && item.status === 'active',
  );

  if (!member) {
    throw new ForbiddenException('User is not an active family member');
  }

  return new Types.ObjectId(user.activeFamilyId);
}
