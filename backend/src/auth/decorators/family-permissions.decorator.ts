import { SetMetadata } from '@nestjs/common';
import { FAMILY_PERMISSIONS } from '../../families/schemas/family.schema';

export const FAMILY_PERMISSIONS_KEY = 'familyPermissions';

export const FamilyPermissions = (
  ...permissions: Array<(typeof FAMILY_PERMISSIONS)[number]>
) => SetMetadata(FAMILY_PERMISSIONS_KEY, permissions);
