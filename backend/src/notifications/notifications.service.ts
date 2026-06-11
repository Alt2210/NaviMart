import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { Notification } from './schemas/notification.schema';

export type CreateNotificationInput = {
  userId: Types.ObjectId;
  familyId?: Types.ObjectId;
  type: Notification['type'];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  dedupeKey: string;
};

export type NotificationResponse = {
  id: string;
  userId: string;
  familyId?: string;
  type: Notification['type'];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  readAt?: Date;
  createdAt?: Date;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async findAll(user: AuthenticatedUser, query: ListNotificationsQueryDto) {
    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(user.userId),
    };

    if (query.unreadOnly) {
      filter.readAt = { $exists: false };
    }

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(query.limit ?? 50)
      .exec();

    return notifications.map((notification) =>
      this.toNotificationResponse(notification),
    );
  }

  async markAsRead(user: AuthenticatedUser, notificationId: string) {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        {
          _id: notificationId,
          userId: user.userId,
        },
        {
          $set: {
            readAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();

    return notification ? this.toNotificationResponse(notification) : null;
  }

  async markAllAsRead(user: AuthenticatedUser) {
    const result = await this.notificationModel
      .updateMany(
        {
          userId: user.userId,
          readAt: { $exists: false },
        },
        {
          $set: {
            readAt: new Date(),
          },
        },
      )
      .exec();

    return { modifiedCount: result.modifiedCount };
  }

  async createManyDeduped(inputs: CreateNotificationInput[]) {
    if (inputs.length === 0) {
      return { createdCount: 0, created: [] as NotificationResponse[] };
    }

    const operations = inputs.map((input) => ({
      updateOne: {
        filter: { dedupeKey: input.dedupeKey },
        update: {
          $setOnInsert: input,
        },
        upsert: true,
      },
    }));

    const result = await this.notificationModel.bulkWrite(operations, {
      ordered: false,
    });

    const upsertedIds = Object.values(result.upsertedIds ?? {});
    const createdNotifications =
      upsertedIds.length > 0
        ? await this.notificationModel
            .find({ _id: { $in: upsertedIds } })
            .exec()
        : [];

    return {
      createdCount: result.upsertedCount,
      created: createdNotifications.map((notification) =>
        this.toNotificationResponse(notification),
      ),
    };
  }

  private toNotificationResponse(notification: Notification) {
    return {
      id: notification._id.toString(),
      userId: notification.userId.toString(),
      familyId: notification.familyId?.toString(),
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      readAt: notification.readAt,
      createdAt: (notification as Notification & { createdAt?: Date }).createdAt,
    };
  }
}
