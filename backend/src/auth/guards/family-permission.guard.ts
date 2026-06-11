import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Family,
  FAMILY_PERMISSIONS,
} from '../../families/schemas/family.schema';
import { FAMILY_PERMISSIONS_KEY } from '../decorators/family-permissions.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class FamilyPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      Array<(typeof FAMILY_PERMISSIONS)[number]>
    >(FAMILY_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
      params?: Record<string, string>;
    }>();
    const user = request.user;

    const familyId = request.params?.familyId ?? user?.activeFamilyId;

    if (!user || !familyId) {
      throw new ForbiddenException('User is not attached to a family');
    }

    const userObjectId = new Types.ObjectId(user.userId);
    const familyObjectId = new Types.ObjectId(familyId);

    const family = await this.familyModel
      .findById(familyObjectId)
      .lean()
      .exec();

    const member = family?.members.find(
      (item) =>
        item.userId.toString() === userObjectId.toString() &&
        item.status === 'active',
    );

    if (!member) {
      throw new ForbiddenException('User is not an active family member');
    }

    if (member.role === 'owner' || member.role === 'admin') {
      return true;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      member.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Missing family permission');
    }

    return true;
  }
}
