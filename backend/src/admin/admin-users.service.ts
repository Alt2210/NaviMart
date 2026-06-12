import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = this.buildUserFilter(query);

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      items: users.map((user) => this.toUserResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await hash(dto.password, 12);

    try {
      const user = await this.userModel.create({
        email: dto.email?.toLowerCase(),
        phone: dto.phone,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: dto.displayName ?? `${dto.firstName} ${dto.lastName}`,
        role: dto.role ?? 'member',
        status: dto.status ?? 'active',
      });

      return this.toUserResponse(user);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('Email or phone already exists');
      }

      throw error;
    }
  }

  async update(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.displayName !== undefined) user.displayName = dto.displayName;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.password !== undefined) {
      user.passwordHash = await hash(dto.password, 12);
    }

    await user.save();
    return this.toUserResponse(user);
  }

  async remove(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel
      .updateOne(
        { _id: user._id },
        {
          $set: { status: 'inactive' },
          $unset: { refreshTokenHash: 1 },
        },
      )
      .exec();

    return { success: true };
  }

  private buildUserFilter(query: ListUsersQueryDto) {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.role) {
      filter.role = query.role;
    }
    if (query.search) {
      const regex = {
        $regex: this.escapeRegExp(query.search.trim()),
        $options: 'i',
      };
      filter.$or = [
        { email: regex },
        { phone: regex },
        { firstName: regex },
        { lastName: regex },
        { displayName: regex },
      ];
    }

    return filter;
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private toUserResponse(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      role: user.role,
      status: user.status,
      activeFamilyId: user.activeFamilyId?.toString(),
      lastLoginAt: user.lastLoginAt,
    };
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
