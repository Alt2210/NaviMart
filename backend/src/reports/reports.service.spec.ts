import { Types } from 'mongoose';
import {
  createMockModel,
  MockModel,
  mockQuery,
} from '../../test/utils/mock-model';
import { makeFamily, makeUser } from '../../test/utils/fixtures';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let familyModel: MockModel;
  let shoppingListModel: MockModel;
  let pantryItemModel: MockModel;
  let inventoryEventModel: MockModel;
  let user: ReturnType<typeof makeUser>;
  const range = {
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-30'),
  };

  beforeEach(() => {
    familyModel = createMockModel();
    shoppingListModel = createMockModel();
    pantryItemModel = createMockModel();
    inventoryEventModel = createMockModel();
    user = makeUser();

    familyModel.findById.mockReturnValue(
      mockQuery(
        makeFamily({
          members: [
            { userId: new Types.ObjectId(user.userId), status: 'active' },
          ],
        }),
      ),
    );

    service = new ReportsService(
      familyModel as never,
      shoppingListModel as never,
      pantryItemModel as never,
      inventoryEventModel as never,
    );
  });

  describe('getConsumptionTrends', () => {
    it('maps grouped aggregate output into day/type and top-consumed rows', async () => {
      inventoryEventModel.aggregate
        .mockResolvedValueOnce([
          {
            _id: { day: '2026-06-01', type: 'consumed' },
            totalQuantityDelta: -5,
            eventCount: 2,
          },
        ])
        .mockResolvedValueOnce([
          { _id: { name: 'Rice', unit: 'g' }, quantity: 5, eventCount: 2 },
        ]);

      const result = await service.getConsumptionTrends(user, range as never);

      expect(result.eventsByDay).toEqual([
        {
          day: '2026-06-01',
          type: 'consumed',
          totalQuantityDelta: -5,
          eventCount: 2,
        },
      ]);
      expect(result.topConsumed[0]).toEqual({
        name: 'Rice',
        unit: 'g',
        quantity: 5,
        eventCount: 2,
      });
    });
  });

  describe('getWasteReport', () => {
    it('combines wasted-event aggregates with currently expired active items', async () => {
      inventoryEventModel.aggregate.mockResolvedValue([
        { _id: { name: 'Milk', unit: 'l' }, wastedQuantity: 2, eventCount: 1 },
      ]);
      const expiredId = new Types.ObjectId();
      pantryItemModel.find.mockReturnValue(
        mockQuery([
          {
            _id: expiredId,
            name: 'Yogurt',
            quantity: 1,
            unit: 'pcs',
            expiryDate: new Date('2020-01-01'),
            location: 'fridge',
          },
        ]),
      );

      const result = await service.getWasteReport(user, range as never);

      expect(result.wastedItems[0]).toMatchObject({
        name: 'Milk',
        wastedQuantity: 2,
      });
      expect(result.expiredActiveItems[0]).toMatchObject({
        id: expiredId.toString(),
        name: 'Yogurt',
      });
    });
  });

  describe('getDashboard', () => {
    it('aggregates shopping/pantry/inventory/waste summaries into one payload', async () => {
      shoppingListModel.find.mockReturnValue(
        mockQuery([
          { status: 'completed', items: [{ status: 'bought' }, { status: 'pending' }] },
        ]),
      );
      pantryItemModel.aggregate.mockResolvedValue([]);
      inventoryEventModel.aggregate.mockResolvedValue([]);

      const result = await service.getDashboard(user, range as never);

      expect(result).toEqual(
        expect.objectContaining({
          range,
          shopping: expect.objectContaining({
            totalLists: 1,
            totalItems: 2,
            boughtItems: 1,
            completionRate: 0.5,
          }),
          pantry: expect.any(Object),
          inventory: expect.any(Object),
          waste: expect.any(Object),
        }),
      );
    });
  });
});
