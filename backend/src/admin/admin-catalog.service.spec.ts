import { ConflictException, NotFoundException } from '@nestjs/common';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { makeUser, oid } from '../../test/utils/fixtures';
import { AdminCatalogService } from './admin-catalog.service';

function makeCategoryDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    name: 'Rau cu',
    slug: 'rau-cu',
    description: undefined,
    icon: undefined,
    status: 'active',
    save: jest.fn(),
    ...overrides,
  };
}

function makeFoodDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    name: 'Ca chua',
    normalizedName: 'ca chua',
    categoryId: oid(),
    defaultUnit: 'pcs',
    aliases: [],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 7,
    storageTips: undefined,
    imageUrl: undefined,
    barcode: undefined,
    isSystem: true,
    status: 'active',
    save: jest.fn(),
    ...overrides,
  };
}

function makeUnitDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    code: 'kg',
    name: 'Kilogram',
    type: 'mass',
    status: 'active',
    save: jest.fn(),
    ...overrides,
  };
}

describe('AdminCatalogService', () => {
  let service: AdminCatalogService;
  let categoryModel: MockModel;
  let foodModel: MockModel;
  let unitModel: MockModel;

  beforeEach(() => {
    categoryModel = createMockModel();
    foodModel = createMockModel();
    unitModel = createMockModel();
    service = new AdminCatalogService(
      categoryModel as never,
      foodModel as never,
      unitModel as never,
    );
  });

  describe('categories', () => {
    it('findAll xây regex đã escape khi có search', async () => {
      categoryModel.find.mockReturnValue(mockQuery([]));
      await service.findAllCategories({ search: ' a.b ', status: 'active' } as never);
      const filter = categoryModel.find.mock.calls[0][0];
      expect(filter.status).toBe('active');
      expect(filter.name).toEqual({ $regex: 'a\\.b', $options: 'i' });
    });

    it('create tự sinh slug từ tên khi không cung cấp', async () => {
      categoryModel.create.mockResolvedValue(makeCategoryDoc());
      await service.createCategory({ name: 'Rau Củ' } as never);
      expect(categoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'rau-cu' }),
      );
    });

    it('create chuyển lỗi trùng khóa thành Conflict', async () => {
      categoryModel.create.mockRejectedValue({ code: 11000 });
      await expect(
        service.createCategory({ name: 'X' } as never),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('update ném NotFound khi không tồn tại', async () => {
      categoryModel.findById.mockReturnValue(mockQuery(null));
      await expect(
        service.updateCategory(oid().toString(), { name: 'Y' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('remove là xóa mềm (chuyển status archived)', async () => {
      const doc = makeCategoryDoc();
      categoryModel.findById.mockReturnValue(mockQuery(doc));
      const result = await service.removeCategory(doc._id.toString());
      expect(doc.status).toBe('archived');
      expect(doc.save).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('foods', () => {
    const user = makeUser();

    it('create kiểm tra category tồn tại, set normalizedName và isSystem', async () => {
      categoryModel.exists.mockReturnValue(mockQuery({ _id: oid() }));
      foodModel.create.mockResolvedValue(makeFoodDoc());

      await service.createFood(user, {
        name: '  Cà Chua ',
        categoryId: oid().toString(),
        defaultUnit: 'pcs',
      } as never);

      expect(foodModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ normalizedName: 'cà chua', isSystem: true }),
      );
    });

    it('create ném NotFound khi category không tồn tại', async () => {
      categoryModel.exists.mockReturnValue(mockQuery(null));
      await expect(
        service.createFood(user, {
          name: 'X',
          categoryId: oid().toString(),
          defaultUnit: 'pcs',
        } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(foodModel.create).not.toHaveBeenCalled();
    });

    it('create chuyển lỗi trùng khóa thành Conflict', async () => {
      categoryModel.exists.mockReturnValue(mockQuery({ _id: oid() }));
      foodModel.create.mockRejectedValue({ code: 11000 });
      await expect(
        service.createFood(user, {
          name: 'X',
          categoryId: oid().toString(),
          defaultUnit: 'pcs',
        } as never),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('update re-validate category khi đổi categoryId', async () => {
      const doc = makeFoodDoc();
      foodModel.findById.mockReturnValue(mockQuery(doc));
      categoryModel.exists.mockReturnValue(mockQuery({ _id: oid() }));

      await service.updateFood(doc._id.toString(), {
        categoryId: oid().toString(),
      } as never);

      expect(categoryModel.exists).toHaveBeenCalled();
      expect(doc.save).toHaveBeenCalled();
    });

    it('update ném NotFound khi food không tồn tại', async () => {
      foodModel.findById.mockReturnValue(mockQuery(null));
      await expect(
        service.updateFood(oid().toString(), { name: 'Y' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('units', () => {
    it('create chuẩn hóa code về chữ thường', async () => {
      unitModel.create.mockResolvedValue(makeUnitDoc());
      await service.createUnit({ code: ' KG ', name: 'Kilogram', type: 'mass' } as never);
      expect(unitModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'kg' }),
      );
    });

    it('create chuyển lỗi trùng khóa thành Conflict', async () => {
      unitModel.create.mockRejectedValue({ code: 11000 });
      await expect(
        service.createUnit({ code: 'kg', name: 'K', type: 'mass' } as never),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('remove là xóa mềm', async () => {
      const doc = makeUnitDoc();
      unitModel.findById.mockReturnValue(mockQuery(doc));
      const result = await service.removeUnit(doc._id.toString());
      expect(doc.status).toBe('archived');
      expect(result).toEqual({ success: true });
    });
  });
});
