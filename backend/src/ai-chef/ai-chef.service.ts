import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Family } from '../families/schemas/family.schema';
import { resolveActiveFamilyId } from '../families/family-access.util';
import { PantryItem } from '../pantry/schemas/pantry-item.schema';
import { getExpiryStatus } from '../pantry/utils/expiry-status.util';
import { ChatDto } from './dto/chat.dto';
import { TimelyService } from './timely.service';

@Injectable()
export class AiChefService {
  constructor(
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(PantryItem.name)
    private readonly pantryItemModel: Model<PantryItem>,
    private readonly timelyService: TimelyService,
  ) {}

  getStatus() {
    return { configured: this.timelyService.isConfigured };
  }

  async chat(user: AuthenticatedUser, dto: ChatDto) {
    // Users without a family (e.g. the seeded admin) still get a working chef — just with an empty pantry.
    const familyId = await this.getActiveFamilyId(user).catch(() => null);
    const pantryContext = familyId
      ? await this.buildPantryContext(familyId)
      : 'Tủ lạnh của người dùng hiện đang TRỐNG.';
    const conversationId =
      dto.conversationId ?? `conv_${new Types.ObjectId().toString()}`;
    const sessionId = `navimart_${user.userId}_${conversationId}`;

    const prompt = [
      'Bạn là NaviChef — trợ lý bếp ảo của ứng dụng NaviMart (hệ thống đi chợ tiện lợi cho gia đình Việt Nam).',
      'Nhiệm vụ: gợi ý món ăn từ nguyên liệu sẵn có, ưu tiên "giải cứu" thực phẩm sắp hết hạn, hướng dẫn nấu ăn, mẹo bảo quản và lên thực đơn.',
      'Trả lời bằng tiếng Việt, thân thiện, NGẮN GỌN (tối đa ~150 từ trừ khi được hỏi công thức chi tiết). Khi gợi ý món, nói rõ dùng nguyên liệu nào trong tủ lạnh và thiếu gì.',
      '',
      pantryContext,
      '',
      `Câu hỏi của người dùng: ${dto.message.trim()}`,
    ].join('\n');

    const reply = await this.timelyService.complete(sessionId, prompt);

    return { reply, conversationId };
  }

  private async buildPantryContext(familyId: Types.ObjectId): Promise<string> {
    const items = await this.pantryItemModel
      .find({ familyId, status: 'active', quantity: { $gt: 0 } })
      .sort({ expiryDate: 1 })
      .limit(40)
      .lean()
      .exec();

    if (items.length === 0) {
      return 'Tủ lạnh của người dùng hiện đang TRỐNG.';
    }

    const lines = items.map((item) => {
      const expiryStatus = getExpiryStatus(item.expiryDate);
      const daysLeft = Math.ceil(
        (new Date(item.expiryDate).getTime() - Date.now()) /
          (24 * 60 * 60 * 1000),
      );
      const flag =
        expiryStatus === 'expired'
          ? ' [ĐÃ HẾT HẠN]'
          : expiryStatus === 'expiring'
            ? ` [SẮP HẾT HẠN - còn ${Math.max(daysLeft, 0)} ngày]`
            : '';
      return `- ${item.name}: ${item.quantity} ${item.unit}${flag}`;
    });

    return `Tủ lạnh của người dùng hiện có (sắp hết hạn xếp trước):\n${lines.join('\n')}`;
  }

  private getActiveFamilyId(user: AuthenticatedUser) {
    return resolveActiveFamilyId(this.familyModel, user);
  }
}
