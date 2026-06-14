import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { AdminStatsService } from './admin-stats.service';

describe('AdminStatsService', () => {
  let service: AdminStatsService;
  let userModel: MockModel;
  let familyModel: MockModel;
  let recipeModel: MockModel;

  beforeEach(() => {
    userModel = createMockModel();
    familyModel = createMockModel();
    recipeModel = createMockModel();
    service = new AdminStatsService(
      userModel as never,
      familyModel as never,
      recipeModel as never,
    );
  });

  it('aggregates user/family totals and recipe counts grouped by status', async () => {
    userModel.countDocuments
      .mockReturnValueOnce(mockQuery(10)) // total users
      .mockReturnValueOnce(mockQuery(8)); // active users
    familyModel.countDocuments.mockReturnValue(mockQuery(3));
    // aggregate result is awaited directly (no .exec()), so resolve it
    recipeModel.aggregate.mockResolvedValue([
      { _id: 'approved', count: 5 },
      { _id: 'pending', count: 2 },
    ]);

    const result = await service.getStats();

    expect(result.users).toEqual({ total: 10, active: 8 });
    expect(result.families).toEqual({ total: 3 });
    expect(result.recipes.total).toBe(7);
    expect(result.recipes.byStatus).toMatchObject({ approved: 5, pending: 2 });
  });

  it('reports zero counts for every status when there are no recipes', async () => {
    userModel.countDocuments
      .mockReturnValueOnce(mockQuery(0))
      .mockReturnValueOnce(mockQuery(0));
    familyModel.countDocuments.mockReturnValue(mockQuery(0));
    recipeModel.aggregate.mockResolvedValue([]);

    const result = await service.getStats();

    expect(result.recipes.total).toBe(0);
    // every known status is seeded to 0 rather than left undefined
    expect(
      Object.values(result.recipes.byStatus).every((c) => c === 0),
    ).toBe(true);
  });
});
