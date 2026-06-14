import { ConflictException, NotFoundException } from '@nestjs/common';
import { createMockModel, MockModel, mockQuery } from '../../test/utils/mock-model';
import { oid } from '../../test/utils/fixtures';
import { AdminUsersService } from './admin-users.service';

// Avoid running the real (slow) bcrypt and keep assertions deterministic.
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

function makeUserDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: oid(),
    email: 'a@example.com',
    phone: undefined,
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
    avatarUrl: undefined,
    gender: undefined,
    role: 'member',
    status: 'active',
    activeFamilyId: undefined,
    lastLoginAt: undefined,
    passwordHash: 'x',
    save: jest.fn(),
    ...overrides,
  };
}

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let userModel: MockModel;

  beforeEach(() => {
    userModel = createMockModel();
    service = new AdminUsersService(userModel as never);
  });

  describe('findAll', () => {
    it('phân trang và map danh sách người dùng', async () => {
      userModel.find.mockReturnValue(mockQuery([makeUserDoc()]));
      userModel.countDocuments.mockReturnValue(mockQuery(1));

      const result = await service.findAll({} as never);

      expect(result.items).toHaveLength(1);
      expect(result).toMatchObject({ total: 1, page: 1, limit: 20, totalPages: 1 });
    });

    it('xây bộ lọc $or với regex đã escape khi có search', async () => {
      userModel.find.mockReturnValue(mockQuery([]));
      userModel.countDocuments.mockReturnValue(mockQuery(0));

      await service.findAll({ search: ' a.b ', status: 'active' } as never);

      const filter = userModel.find.mock.calls[0][0];
      expect(filter.status).toBe('active');
      expect(filter.$or[0]).toEqual({ email: { $regex: 'a\\.b', $options: 'i' } });
    });
  });

  describe('findOne', () => {
    it('trả về người dùng khi tồn tại', async () => {
      const doc = makeUserDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      const result = await service.findOne(doc._id.toString());
      expect(result.id).toBe(doc._id.toString());
    });

    it('ném NotFound khi không tồn tại', async () => {
      userModel.findById.mockReturnValue(mockQuery(null));
      await expect(service.findOne(oid().toString())).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('băm mật khẩu và tạo người dùng', async () => {
      userModel.create.mockResolvedValue(makeUserDoc());

      const result = await service.create({
        email: 'NEW@Example.com',
        password: 'secret',
        firstName: 'Jane',
        lastName: 'Doe',
      } as never);

      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@example.com', passwordHash: 'hashed-password' }),
      );
      expect(result.id).toBeDefined();
    });

    it('chuyển lỗi trùng khóa thành Conflict', async () => {
      userModel.create.mockRejectedValue({ code: 11000 });

      await expect(
        service.create({
          email: 'dup@example.com',
          password: 'secret',
          firstName: 'A',
          lastName: 'B',
        } as never),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('update', () => {
    it('cập nhật trường được cung cấp rồi lưu', async () => {
      const doc = makeUserDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      await service.update(doc._id.toString(), { role: 'admin', status: 'inactive' } as never);

      expect(doc.role).toBe('admin');
      expect(doc.status).toBe('inactive');
      expect(doc.save).toHaveBeenCalled();
    });

    it('băm lại mật khẩu khi đổi mật khẩu', async () => {
      const doc = makeUserDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));

      await service.update(doc._id.toString(), { password: 'newpass' } as never);

      expect(doc.passwordHash).toBe('hashed-password');
    });

    it('ném NotFound khi không tồn tại', async () => {
      userModel.findById.mockReturnValue(mockQuery(null));
      await expect(
        service.update(oid().toString(), { role: 'admin' } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('vô hiệu hóa người dùng (soft delete) thay vì xóa cứng', async () => {
      const doc = makeUserDoc();
      userModel.findById.mockReturnValue(mockQuery(doc));
      userModel.updateOne.mockReturnValue(mockQuery({ modifiedCount: 1 }));

      const result = await service.remove(doc._id.toString());

      const [filter, update] = userModel.updateOne.mock.calls[0];
      expect(filter).toEqual({ _id: doc._id });
      expect(update.$set).toEqual({ status: 'inactive' });
      expect(update.$unset).toEqual({ refreshTokenHash: 1 });
      expect(result).toEqual({ success: true });
    });

    it('ném NotFound khi không tồn tại', async () => {
      userModel.findById.mockReturnValue(mockQuery(null));
      await expect(service.remove(oid().toString())).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
