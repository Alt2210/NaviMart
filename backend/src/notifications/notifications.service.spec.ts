import { Types } from 'mongoose';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { makeUser, oid } from '../../test/utils/fixtures';
import { NotificationsService } from './notifications.service';

function makeNotificationDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    userId: oid(),
    familyId: undefined,
    type: 'expiry',
    title: 'Sắp hết hạn',
    body: 'Sữa sắp hết hạn',
    data: {},
    readAt: undefined,
    createdAt: new Date('2026-06-14'),
    ...overrides,
  };
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  let model: MockModel;
  let user: ReturnType<typeof makeUser>;

  beforeEach(() => {
    model = createMockModel();
    user = makeUser();
    service = new NotificationsService(model as never);
  });

  describe('findAll', () => {
    it('scopes to the current user and applies the default limit', async () => {
      const query = mockQuery([makeNotificationDoc()]);
      model.find.mockReturnValue(query);

      const result = await service.findAll(user, {} as never);

      const filter = model.find.mock.calls[0][0];
      expect(filter.userId).toBeInstanceOf(Types.ObjectId);
      expect(filter.userId.toString()).toBe(user.userId);
      expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(query.limit).toHaveBeenCalledWith(50);
      expect(result).toHaveLength(1);
    });

    it('filters to unread notifications when unreadOnly is set', async () => {
      model.find.mockReturnValue(mockQuery([]));

      await service.findAll(user, { unreadOnly: true, limit: 10 } as never);

      const filter = model.find.mock.calls[0][0];
      expect(filter.readAt).toEqual({ $exists: false });
    });
  });

  describe('markAsRead', () => {
    it('stamps readAt for a notification owned by the user', async () => {
      const doc = makeNotificationDoc();
      model.findOneAndUpdate = jest.fn(() => mockQuery(doc));

      const result = await service.markAsRead(user, doc._id.toString());

      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: doc._id.toString(), userId: user.userId },
        { $set: { readAt: expect.any(Date) } },
        { new: true },
      );
      expect(result?.id).toBe(doc._id.toString());
    });

    it('returns null when no matching notification is found', async () => {
      model.findOneAndUpdate = jest.fn(() => mockQuery(null));

      const result = await service.markAsRead(user, oid().toString());

      expect(result).toBeNull();
    });
  });

  describe('markAllAsRead', () => {
    it('updates all unread notifications and returns the modified count', async () => {
      model.updateMany.mockReturnValue(mockQuery({ modifiedCount: 3 }));

      const result = await service.markAllAsRead(user);

      const [filter] = model.updateMany.mock.calls[0];
      expect(filter).toMatchObject({
        userId: user.userId,
        readAt: { $exists: false },
      });
      expect(result).toEqual({ modifiedCount: 3 });
    });
  });

  describe('createManyDeduped', () => {
    it('returns early without writing when there are no inputs', async () => {
      model.bulkWrite = jest.fn();

      const result = await service.createManyDeduped([]);

      expect(model.bulkWrite).not.toHaveBeenCalled();
      expect(result).toEqual({ createdCount: 0, created: [] });
    });

    it('upserts by dedupeKey and returns only the newly created notifications', async () => {
      const upsertedId = oid();
      const createdDoc = makeNotificationDoc({ _id: upsertedId });
      model.bulkWrite = jest.fn().mockResolvedValue({
        upsertedCount: 1,
        upsertedIds: { '0': upsertedId },
      });
      model.find.mockReturnValue(mockQuery([createdDoc]));

      const input = {
        userId: new Types.ObjectId(user.userId),
        type: 'expiry' as const,
        title: 't',
        body: 'b',
        dedupeKey: 'expiry:itemA',
      };
      const result = await service.createManyDeduped([input]);

      // one upsert operation, unordered
      expect(model.bulkWrite).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            updateOne: expect.objectContaining({
              filter: { dedupeKey: 'expiry:itemA' },
              upsert: true,
            }),
          }),
        ],
        { ordered: false },
      );
      expect(model.find).toHaveBeenCalledWith({ _id: { $in: [upsertedId] } });
      expect(result.createdCount).toBe(1);
      expect(result.created[0].id).toBe(upsertedId.toString());
    });
  });
});
