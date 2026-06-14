import { ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { makeUser } from '../../test/utils/fixtures';
import { resolveActiveFamilyId } from './family-access.util';

describe('resolveActiveFamilyId', () => {
  let familyModel: MockModel;

  beforeEach(() => {
    familyModel = createMockModel();
  });

  it('throws Forbidden when the user has no active family', async () => {
    const user = makeUser({ activeFamilyId: undefined });
    await expect(
      resolveActiveFamilyId(familyModel as never, user),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(familyModel.findById).not.toHaveBeenCalled();
  });

  it('throws Forbidden when the family is not found', async () => {
    const user = makeUser();
    familyModel.findById.mockReturnValue(mockQuery(null));
    await expect(
      resolveActiveFamilyId(familyModel as never, user),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws Forbidden when the user is not an active member', async () => {
    const user = makeUser();
    familyModel.findById.mockReturnValue(
      mockQuery({
        _id: new Types.ObjectId(user.activeFamilyId),
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'removed' },
        ],
      }),
    );
    await expect(
      resolveActiveFamilyId(familyModel as never, user),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns the active family ObjectId for an active member', async () => {
    const user = makeUser();
    familyModel.findById.mockReturnValue(
      mockQuery({
        _id: new Types.ObjectId(user.activeFamilyId),
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active' },
        ],
      }),
    );

    const result = await resolveActiveFamilyId(familyModel as never, user);
    expect(result).toBeInstanceOf(Types.ObjectId);
    expect(result.toString()).toBe(user.activeFamilyId);
  });
});
