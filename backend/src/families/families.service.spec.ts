import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Types } from 'mongoose';
import {
  createMockModel,
  MockModel,
  mockQuery,
} from '../../test/utils/mock-model';
import { makeUser, oid } from '../../test/utils/fixtures';
import { FamiliesService } from './families.service';

function hashCode(code: string) {
  return createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}

function makeFamilyDoc(overrides: Record<string, unknown> = {}) {
  const doc = {
    _id: oid(),
    name: 'Fam',
    ownerId: oid(),
    members: [] as Array<Record<string, unknown>>,
    inviteCodes: [] as Array<Record<string, unknown>>,
    save: jest.fn(),
    ...overrides,
  };
  doc.save = (overrides.save as jest.Mock) ?? jest.fn().mockResolvedValue(doc);
  return doc;
}

describe('FamiliesService', () => {
  let service: FamiliesService;
  let familyModel: MockModel;
  let userModel: MockModel;

  beforeEach(() => {
    familyModel = createMockModel();
    userModel = createMockModel();
    userModel.updateOne.mockReturnValue(mockQuery({ modifiedCount: 1 }));
    service = new FamiliesService(familyModel as never, userModel as never);
  });

  describe('create', () => {
    it('creates an owner family and sets it as the user active family', async () => {
      const user = makeUser();
      const created = makeFamilyDoc({
        members: [
          {
            userId: new Types.ObjectId(user.userId),
            role: 'owner',
            status: 'active',
            permissions: ['manage_family'],
          },
        ],
      });
      familyModel.create.mockResolvedValue(created);

      const result = await service.create(user, { name: 'Home' } as never);

      expect(familyModel.create).toHaveBeenCalled();
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: new Types.ObjectId(user.userId) },
        { $set: { activeFamilyId: created._id } },
      );
      expect(result.members).toHaveLength(1);
    });
  });

  describe('getCurrentFamily', () => {
    it('throws NotFound when the user has no active family', async () => {
      await expect(
        service.getCurrentFamily(makeUser({ activeFamilyId: undefined })),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns the populated family for an active member', async () => {
      const user = makeUser();
      const family = makeFamilyDoc({
        members: [
          {
            userId: new Types.ObjectId(user.userId),
            role: 'owner',
            status: 'active',
            permissions: ['manage_family'],
          },
        ],
      });
      // getCurrentFamily uses findById().populate().exec()
      familyModel.findById.mockReturnValue(mockQuery(family));

      const result = await service.getCurrentFamily(user);
      expect(result.id).toBe(family._id.toString());
      expect(result.members[0].userId).toBe(user.userId);
    });
  });

  describe('join', () => {
    it('throws NotFound when no family matches the invite code', async () => {
      familyModel.findOne.mockReturnValue(mockQuery(null));
      await expect(
        service.join(makeUser(), { inviteCode: 'NOPE' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws Conflict when the user is already an active member', async () => {
      const user = makeUser();
      const code = 'ABCDEF';
      const family = makeFamilyDoc({
        inviteCodes: [
          {
            codeHash: hashCode(code),
            permissions: ['edit_lists'],
            expiresAt: new Date(Date.now() + 3600_000),
          },
        ],
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active' },
        ],
      });
      familyModel.findOne.mockReturnValue(mockQuery(family));

      await expect(
        service.join(user, { inviteCode: code } as never),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('adds a new member, consumes the invite, and sets the active family', async () => {
      const user = makeUser();
      const code = 'JOIN12';
      const invite = {
        codeHash: hashCode(code),
        permissions: ['edit_lists', 'manage_pantry'],
        expiresAt: new Date(Date.now() + 3600_000),
      };
      const family = makeFamilyDoc({ inviteCodes: [invite], members: [] });
      familyModel.findOne.mockReturnValue(mockQuery(family));

      await service.join(user, { inviteCode: code } as never);

      expect(family.members).toHaveLength(1);
      expect(family.members[0]).toMatchObject({
        status: 'active',
        role: 'member',
        permissions: ['edit_lists', 'manage_pantry'],
      });
      expect((invite as { usedAt?: Date }).usedAt).toBeInstanceOf(Date);
      expect(family.save).toHaveBeenCalled();
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: user.userId },
        { $set: { activeFamilyId: family._id } },
      );
    });
  });

  describe('createInvite', () => {
    it('generates a code, stores its hash, and returns the plaintext once', async () => {
      const user = makeUser();
      const family = makeFamilyDoc({
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active' },
        ],
      });
      familyModel.findById.mockReturnValue(mockQuery(family));

      const result = await service.createInvite(user, {
        permissions: ['edit_lists'],
      } as never);

      expect(result.inviteCode).toEqual(expect.any(String));
      expect(family.inviteCodes).toHaveLength(1);
      // Only the hash is persisted, never the plaintext code.
      expect((family.inviteCodes[0] as { codeHash: string }).codeHash).toBe(
        hashCode(result.inviteCode),
      );
      expect(family.save).toHaveBeenCalled();
    });
  });

  describe('updateMemberPermissions', () => {
    function setup(user = makeUser()) {
      const targetId = oid();
      const family = makeFamilyDoc({
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active', role: 'owner' },
          { userId: targetId, status: 'active', role: 'member', permissions: [] },
        ],
      });
      familyModel.findById.mockReturnValue(mockQuery(family));
      return { user, targetId, family };
    }

    it('rejects updating your own permissions', async () => {
      const user = makeUser();
      await expect(
        service.updateMemberPermissions(user, user.userId, {
          permissions: ['edit_lists'],
        } as never),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('forbids updating the family owner', async () => {
      const user = makeUser();
      const ownerId = oid();
      const family = makeFamilyDoc({
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active', role: 'admin' },
          { userId: ownerId, status: 'active', role: 'owner' },
        ],
      });
      familyModel.findById.mockReturnValue(mockQuery(family));

      await expect(
        service.updateMemberPermissions(user, ownerId.toString(), {
          permissions: ['edit_lists'],
        } as never),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects assigning the owner role', async () => {
      const { user, targetId } = setup();
      await expect(
        service.updateMemberPermissions(user, targetId.toString(), {
          permissions: ['edit_lists'],
          role: 'owner',
        } as never),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('updates permissions for a regular member', async () => {
      const { user, targetId, family } = setup();
      await service.updateMemberPermissions(user, targetId.toString(), {
        permissions: ['manage_pantry'],
      } as never);

      const target = family.members.find(
        (m) => (m.userId as Types.ObjectId).toString() === targetId.toString(),
      );
      expect(target?.permissions).toEqual(['manage_pantry']);
      expect(family.save).toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('rejects removing yourself', async () => {
      const user = makeUser();
      await expect(
        service.removeMember(user, user.userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('marks a member as removed and unsets their active family', async () => {
      const user = makeUser();
      const targetId = oid();
      const family = makeFamilyDoc({
        members: [
          { userId: new Types.ObjectId(user.userId), status: 'active', role: 'owner' },
          { userId: targetId, status: 'active', role: 'member', permissions: ['x'] },
        ],
      });
      familyModel.findById.mockReturnValue(mockQuery(family));

      const result = await service.removeMember(user, targetId.toString());

      const target = family.members.find(
        (m) => (m.userId as Types.ObjectId).toString() === targetId.toString(),
      );
      expect(target?.status).toBe('removed');
      expect(target?.permissions).toEqual([]);
      expect(userModel.updateOne).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
