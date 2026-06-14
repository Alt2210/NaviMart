import { NotFoundException } from '@nestjs/common';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { oid } from '../../test/utils/fixtures';
import { AdminRecipesService } from './admin-recipes.service';

function makeRecipeDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    name: 'Pho bo',
    description: 'desc',
    imageUrl: undefined,
    cookTimeMinutes: 45,
    difficulty: 'medium',
    servings: 4,
    status: 'pending',
    moderationNote: undefined,
    tags: ['soup'],
    ingredients: [{}, {}],
    favoritesCount: 0,
    authorId: oid(),
    save: jest.fn(),
    ...overrides,
  };
}

describe('AdminRecipesService', () => {
  let service: AdminRecipesService;
  let recipeModel: MockModel;

  beforeEach(() => {
    recipeModel = createMockModel();
    service = new AdminRecipesService(recipeModel as never);
  });

  describe('findAll', () => {
    it('mặc định lọc status pending, phân trang và tính totalPages', async () => {
      recipeModel.find.mockReturnValue(mockQuery([makeRecipeDoc()]));
      recipeModel.countDocuments.mockReturnValue(mockQuery(1));

      const result = await service.findAll({} as never);

      expect(recipeModel.find).toHaveBeenCalledWith({ status: 'pending' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({ name: 'Pho bo', ingredientCount: 2 });
      expect(result).toMatchObject({ total: 1, page: 1, limit: 20, totalPages: 1 });
    });

    it('áp dụng status từ query', async () => {
      recipeModel.find.mockReturnValue(mockQuery([]));
      recipeModel.countDocuments.mockReturnValue(mockQuery(0));

      await service.findAll({ status: 'approved' } as never);

      expect(recipeModel.find).toHaveBeenCalledWith({ status: 'approved' });
    });
  });

  describe('updateStatus', () => {
    it('cập nhật status + ghi chú kiểm duyệt rồi lưu', async () => {
      const recipe = makeRecipeDoc();
      recipeModel.findById.mockReturnValue(mockQuery(recipe));

      const result = await service.updateStatus(recipe._id.toString(), {
        status: 'approved',
        note: 'OK',
      } as never);

      expect(recipe.status).toBe('approved');
      expect(recipe.moderationNote).toBe('OK');
      expect(recipe.save).toHaveBeenCalled();
      expect(result.status).toBe('approved');
    });

    it('ném NotFound khi công thức không tồn tại', async () => {
      recipeModel.findById.mockReturnValue(mockQuery(null));

      await expect(
        service.updateStatus(oid().toString(), { status: 'approved' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('ném NotFound khi công thức đã bị lưu trữ', async () => {
      recipeModel.findById.mockReturnValue(mockQuery(makeRecipeDoc({ status: 'archived' })));

      await expect(
        service.updateStatus(oid().toString(), { status: 'approved' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
