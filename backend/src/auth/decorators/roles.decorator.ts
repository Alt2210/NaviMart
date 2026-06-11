import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../../users/schemas/user.schema';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Array<(typeof USER_ROLES)[number]>) =>
  SetMetadata(ROLES_KEY, roles);
