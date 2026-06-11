import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getProfile(user: AuthenticatedUser) {
    const profile = await this.userModel.findById(user.userId).exec();

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.toProfileResponse(profile);
  }

  async updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto) {
    const profile = await this.userModel.findById(user.userId).exec();

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    if (dto.firstName !== undefined) profile.firstName = dto.firstName;
    if (dto.lastName !== undefined) profile.lastName = dto.lastName;
    if (dto.displayName !== undefined) {
      profile.displayName = dto.displayName;
    } else if (dto.firstName !== undefined || dto.lastName !== undefined) {
      profile.displayName = `${profile.firstName} ${profile.lastName}`;
    }
    if (dto.avatarUrl !== undefined) profile.avatarUrl = dto.avatarUrl;
    if (dto.dateOfBirth !== undefined) profile.dateOfBirth = dto.dateOfBirth;
    if (dto.gender !== undefined) profile.gender = dto.gender;
    if (dto.expiryReminder !== undefined) {
      profile.notificationSettings.expiryReminder = dto.expiryReminder;
    }
    if (dto.expiryReminderDays !== undefined) {
      profile.notificationSettings.expiryReminderDays = dto.expiryReminderDays;
    }
    if (dto.shoppingReminder !== undefined) {
      profile.notificationSettings.shoppingReminder = dto.shoppingReminder;
    }

    await profile.save();
    return this.toProfileResponse(profile);
  }

  private toProfileResponse(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      status: user.status,
      activeFamilyId: user.activeFamilyId?.toString(),
      notificationSettings: user.notificationSettings,
    };
  }
}
