import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { Category } from '../catalog/schemas/category.schema';
import { Food, FOOD_STORAGE_LOCATIONS } from '../catalog/schemas/food.schema';
import { Family } from '../families/schemas/family.schema';
import { resolveActiveFamilyId } from '../families/family-access.util';
import { InventoryEventsService } from '../inventory-events/inventory-events.service';
import { PantryItem } from '../pantry/schemas/pantry-item.schema';
import { RealtimeService } from '../realtime/realtime.service';
import { CompleteShoppingListDto } from './dto/complete-shopping-list.dto';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { ListShoppingListsQueryDto } from './dto/list-shopping-lists-query.dto';
import { UpdateShoppingListItemDto } from './dto/update-shopping-list-item.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import {
  ShoppingList,
  ShoppingListDocument,
  ShoppingListItem,
} from './schemas/shopping-list.schema';
import { toShoppingListResponse } from './shopping-list.mapper';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectModel(ShoppingList.name)
    private readonly shoppingListModel: Model<ShoppingList>,
    @InjectModel(Family.name) private readonly familyModel: Model<Family>,
    @InjectModel(Food.name) private readonly foodModel: Model<Food>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(PantryItem.name)
    private readonly pantryItemModel: Model<PantryItem>,
    private readonly inventoryEventsService: InventoryEventsService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async findAll(
    user: AuthenticatedUser,
    query: ListShoppingListsQueryDto,
  ) {
    const familyId = await this.getActiveFamilyId(user);

    const filter: Record<string, unknown> = { familyId };
    if (query.status) {
      filter.status = query.status;
    }

    const lists = await this.shoppingListModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    return lists.map((list) => this.toShoppingListResponse(list));
  }

  async create(user: AuthenticatedUser, dto: CreateShoppingListDto) {
    const familyId = await this.getActiveFamilyId(user);

    const list = await this.shoppingListModel.create({
      familyId,
      name: dto.name,
      type: dto.type ?? 'custom',
      plannedFor: dto.plannedFor,
      createdBy: new Types.ObjectId(user.userId),
    });

    return this.emitListUpdated(this.toShoppingListResponse(list));
  }

  async findOne(user: AuthenticatedUser, listId: string) {
    const list = await this.findListForUser(user, listId);
    return this.toShoppingListResponse(list);
  }

  async update(
    user: AuthenticatedUser,
    listId: string,
    dto: UpdateShoppingListDto,
  ) {
    const list = await this.findListForUser(user, listId);

    if (dto.name !== undefined) {
      list.name = dto.name;
    }
    if (dto.type !== undefined) {
      list.type = dto.type;
    }
    if (dto.status !== undefined) {
      list.status = dto.status;
      list.completedAt = dto.status === 'completed' ? new Date() : undefined;
    }
    if (dto.plannedFor !== undefined) {
      list.plannedFor = dto.plannedFor;
    }

    await list.save();
    return this.emitListUpdated(this.toShoppingListResponse(list));
  }

  async remove(user: AuthenticatedUser, listId: string) {
    const list = await this.findListForUser(user, listId);
    list.status = 'archived';
    await list.save();

    this.realtimeService.emitToFamily(
      list.familyId.toString(),
      'shoppingList:removed',
      { id: list._id.toString() },
    );

    return { success: true };
  }

  async addItem(
    user: AuthenticatedUser,
    listId: string,
    dto: CreateShoppingListItemDto,
  ) {
    const list = await this.findListForUser(user, listId);
    const item = await this.buildShoppingListItem(dto);

    list.items.push(item as ShoppingListItem);
    await list.save();

    return this.emitListUpdated(this.toShoppingListResponse(list));
  }

  async updateItem(
    user: AuthenticatedUser,
    listId: string,
    itemId: string,
    dto: UpdateShoppingListItemDto,
  ) {
    const list = await this.findListForUser(user, listId);
    const item = this.findItemOrThrow(list, itemId);

    if (dto.foodId !== undefined) {
      const catalogItem = await this.getFood(dto.foodId);
      item.foodId = catalogItem._id;
      item.name = catalogItem.name;
      item.categoryId = catalogItem.categoryId;
      item.unit = catalogItem.defaultUnit;
    }

    if (dto.categoryId !== undefined) {
      await this.assertCategoryExists(dto.categoryId);
      item.categoryId = new Types.ObjectId(dto.categoryId);
    }
    if (dto.name !== undefined) {
      item.name = dto.name;
    }
    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }
    if (dto.unit !== undefined) {
      item.unit = dto.unit;
    }
    if (dto.note !== undefined) {
      item.note = dto.note;
    }
    if (dto.checked !== undefined) {
      item.checked = dto.checked;
      item.status = dto.checked ? 'bought' : 'pending';
      item.boughtAt = dto.checked ? new Date() : undefined;
    }
    if (dto.status !== undefined) {
      item.status = dto.status;
      item.checked = dto.status === 'bought';
      item.boughtAt = dto.status === 'bought' ? new Date() : undefined;
    }

    await list.save();
    return this.emitListUpdated(this.toShoppingListResponse(list));
  }

  async removeItem(user: AuthenticatedUser, listId: string, itemId: string) {
    const list = await this.findListForUser(user, listId);
    const item = this.findItemOrThrow(list, itemId);
    list.items = list.items.filter(
      (currentItem) => currentItem._id.toString() !== item._id.toString(),
    );
    await list.save();

    return this.emitListUpdated(this.toShoppingListResponse(list));
  }

  async complete(
    user: AuthenticatedUser,
    listId: string,
    dto: CompleteShoppingListDto,
  ) {
    const list = await this.findListForUser(user, listId);

    if (list.status === 'completed') {
      throw new BadRequestException('Shopping list is already completed');
    }
    if (list.status === 'archived') {
      throw new BadRequestException('Archived shopping list cannot be completed');
    }

    const boughtItems = list.items.filter(
      (item) => item.checked || item.status === 'bought',
    );

    if (boughtItems.length === 0) {
      throw new BadRequestException(
        'No checked shopping list items to add to pantry',
      );
    }

    const pantryMetadataByItemId = new Map(
      (dto.pantryItems ?? []).map((item) => [item.itemId, item]),
    );
    const foodIds = boughtItems
      .map((item) => item.foodId?.toString())
      .filter((foodId): foodId is string => Boolean(foodId));
    const foods = await this.foodModel
      .find({ _id: { $in: foodIds }, status: 'active' })
      .exec();
    const foodById = new Map(foods.map((food) => [food._id.toString(), food]));

    const createdPantryItems = await this.pantryItemModel.insertMany(
      boughtItems.map((item) => {
        const metadata = pantryMetadataByItemId.get(item._id.toString());
        const food = item.foodId
          ? foodById.get(item.foodId.toString())
          : undefined;

        return {
          familyId: list.familyId,
          foodId: item.foodId,
          categoryId: item.categoryId,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          expiryDate:
            metadata?.expiryDate ??
            this.getDefaultExpiryDate(
              food?.defaultShelfLifeDays ?? dto.defaultExpiryDays ?? 7,
            ),
          location:
            metadata?.location ??
            food?.defaultStorageLocation ??
            dto.defaultLocation ??
            'fridge',
          status: 'active',
          source: 'shopping',
          createdBy: new Types.ObjectId(user.userId),
          note: metadata?.note ?? item.note,
        };
      }),
    );

    await this.inventoryEventsService.createMany(
      createdPantryItems.map((item) => ({
        familyId: item.familyId,
        pantryItemId: item._id,
        foodId: item.foodId,
        categoryId: item.categoryId,
        name: item.name,
        quantityDelta: item.quantity,
        quantityAfter: item.quantity,
        unit: item.unit,
        type: 'added',
        source: 'shopping',
        createdBy: new Types.ObjectId(user.userId),
        note: item.note,
      })),
    );

    list.status = 'completed';
    list.completedAt = new Date();
    list.items.forEach((item) => {
      if (item.checked || item.status === 'bought') {
        item.checked = true;
        item.status = 'bought';
        item.boughtAt = item.boughtAt ?? new Date();
      }
    });
    await list.save();

    return {
      shoppingList: this.emitListUpdated(this.toShoppingListResponse(list)),
      pantryItems: createdPantryItems.map((item) => ({
        id: item._id.toString(),
        foodId: item.foodId?.toString(),
        categoryId: item.categoryId?.toString(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expiryDate: item.expiryDate,
        location: item.location,
        status: item.status,
        source: item.source,
      })),
    };
  }

  private emitListUpdated(
    response: ReturnType<ShoppingListsService['toShoppingListResponse']>,
  ) {
    this.realtimeService.emitToFamily(
      response.familyId,
      'shoppingList:updated',
      response,
    );

    return response;
  }

  private async buildShoppingListItem(dto: CreateShoppingListItemDto) {
    if (dto.foodId) {
      const food = await this.getFood(dto.foodId);
      return {
        foodId: food._id,
        name: food.name,
        categoryId: dto.categoryId
          ? new Types.ObjectId(dto.categoryId)
          : food.categoryId,
        quantity: dto.quantity,
        unit: dto.unit ?? food.defaultUnit,
        note: dto.note,
      };
    }

    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }

    return {
      name: dto.name!,
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      quantity: dto.quantity,
      unit: dto.unit!,
      note: dto.note,
    };
  }

  private async findListForUser(user: AuthenticatedUser, listId: string) {
    const familyId = await this.getActiveFamilyId(user);
    const list = await this.shoppingListModel
      .findOne({ _id: listId, familyId })
      .exec();

    if (!list) {
      throw new NotFoundException('Shopping list not found');
    }

    return list;
  }

  private getActiveFamilyId(user: AuthenticatedUser) {
    return resolveActiveFamilyId(this.familyModel, user);
  }

  private async getFood(foodId: string) {
    const food = await this.foodModel
      .findOne({ _id: foodId, status: 'active' })
      .exec();

    if (!food) {
      throw new NotFoundException('Food catalog item not found');
    }

    return food;
  }

  private async assertCategoryExists(categoryId: string) {
    const exists = await this.categoryModel
      .exists({ _id: categoryId, status: 'active' })
      .exec();

    if (!exists) {
      throw new NotFoundException('Category not found');
    }
  }

  private getDefaultExpiryDate(daysFromToday: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysFromToday);
    return expiryDate;
  }

  private findItemOrThrow(
    list: ShoppingListDocument,
    itemId: string,
  ): ShoppingListItem {
    const item = list.items.find(
      (currentItem) => currentItem._id.toString() === itemId,
    );

    if (!item) {
      throw new NotFoundException('Shopping list item not found');
    }

    return item;
  }

  private toShoppingListResponse(list: ShoppingListDocument | ShoppingList) {
    return toShoppingListResponse(list);
  }
}
