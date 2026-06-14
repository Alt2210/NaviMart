import { NotFoundException } from '@nestjs/common';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { makeUser, oid } from '../../test/utils/fixtures';
import { UsersService } from './users.service';

/**
 * Builds a hydrated user document stub: plain fields plus a `save` mock and a
 * mutable `notificationSettings` object, matching what UsersService mutates.
 */
function makeProfileDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    email: 'user@example.com',
    phone: '0900000000',
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
    avatarUrl: undefined,
    dateOfBirth: undefined,
    gender: undefined,
    role: 'user',
    status: 'active',
    activeFamilyId: oid(),
    notificationSettings: {
      expiryReminder: true,
      expiryReminderDays: 3,
      shoppingReminder: false,
    },
    save: jest.fn(),
    ...overrides,
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let userModel: MockModel;
  let user: ReturnType<typeof makeUser>;

  beforeEach(() => {
    userModel = createMockModel();
    user = makeUser();
    service = new UsersService(userModel as never);
  });

  describe('getProfile', () => {
    it('maps the stored user to the profile response shape', async () => {
      const doc = makeProfileDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      const result = await service.getProfile(user);

      expect(userModel.findById).toHaveBeenCalledWith(user.userId);
      expect(result).toMatchObject({
        id: doc._id.toString(),
        email: 'user@example.com',
        displayName: 'Jane Doe',
        role: 'user',
        activeFamilyId: doc.activeFamilyId.toString(),
        notificationSettings: doc.notificationSettings,
      });
    });

    it('throws NotFound when the user does not exist', async () => {
      userModel.findById.mockReturnValue(mockQuery(null));

      await expect(service.getProfile(user)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('updates provided fields and persists the document', async () => {
      const doc = makeProfileDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      const result = await service.updateProfile(user, {
        avatarUrl: 'http://img/avatar.png',
        gender: 'female',
      } as never);

      expect(doc.avatarUrl).toBe('http://img/avatar.png');
      expect(doc.gender).toBe('female');
      expect(doc.save).toHaveBeenCalledTimes(1);
      expect(result.avatarUrl).toBe('http://img/avatar.png');
    });

    it('derives displayName from first/last name when displayName is omitted', async () => {
      const doc = makeProfileDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      await service.updateProfile(user, {
        firstName: 'John',
        lastName: 'Smith',
      } as never);

      expect(doc.displayName).toBe('John Smith');
    });

    it('keeps an explicit displayName instead of deriving it', async () => {
      const doc = makeProfileDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      await service.updateProfile(user, {
        firstName: 'John',
        displayName: 'JD',
      } as never);

      expect(doc.displayName).toBe('JD');
    });

    it('updates nested notification settings selectively', async () => {
      const doc = makeProfileDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      await service.updateProfile(user, {
        expiryReminder: false,
        expiryReminderDays: 7,
      } as never);

      expect(doc.notificationSettings.expiryReminder).toBe(false);
      expect(doc.notificationSettings.expiryReminderDays).toBe(7);
      // untouched field stays as-is
      expect(doc.notificationSettings.shoppingReminder).toBe(false);
    });

    it('throws NotFound when the user does not exist', async () => {
      userModel.findById.mockReturnValue(mockQuery(null));

      await expect(
        service.updateProfile(user, { firstName: 'X' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
