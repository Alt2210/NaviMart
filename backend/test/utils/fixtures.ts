/**
 * Plain-object factories for building test data. They return objects shaped
 * like the lean documents / hydrated docs the services consume, so tests can
 * focus on the field under test and rely on sensible defaults for the rest.
 */
import { Types } from 'mongoose';
import { AuthenticatedUser } from '../src/auth/types/authenticated-user.type';

export function oid(): Types.ObjectId {
  return new Types.ObjectId();
}

export function makeUser(
  overrides: Partial<AuthenticatedUser> = {},
): AuthenticatedUser {
  return {
    userId: new Types.ObjectId().toString(),
    email: 'user@example.com',
    role: 'user',
    activeFamilyId: new Types.ObjectId().toString(),
    ...overrides,
  };
}

type MemberInput = {
  userId: Types.ObjectId | string;
  role?: string;
  status?: string;
  permissions?: string[];
};

export function makeFamily(overrides: Record<string, unknown> = {}) {
  const ownerId = oid();
  return {
    _id: oid(),
    name: 'Test Family',
    ownerId,
    members: [
      {
        userId: ownerId,
        role: 'owner',
        status: 'active',
        permissions: ['edit_lists', 'manage_pantry'],
      },
    ],
    inviteCodes: [] as unknown[],
    save: jest.fn(),
    ...overrides,
  };
}

export function makeMember(input: MemberInput) {
  return {
    userId:
      typeof input.userId === 'string'
        ? new Types.ObjectId(input.userId)
        : input.userId,
    role: input.role ?? 'member',
    status: input.status ?? 'active',
    permissions: input.permissions ?? ['edit_lists'],
  };
}

type IngredientInput = {
  foodId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  name?: string;
  quantity?: number;
  unit?: string;
  optional?: boolean;
};

export function makeIngredient(input: IngredientInput = {}) {
  return {
    foodId: input.foodId,
    categoryId: input.categoryId,
    name: input.name ?? 'Tomato',
    quantity: input.quantity ?? 2,
    unit: input.unit ?? 'pcs',
    optional: input.optional ?? false,
  };
}

export function makeRecipe(overrides: Record<string, unknown> = {}) {
  const recipe = {
    _id: oid(),
    name: 'Test Recipe',
    normalizedName: 'test recipe',
    description: 'A recipe',
    imageUrl: undefined,
    cookTimeMinutes: 30,
    difficulty: 'easy',
    servings: 2,
    ingredients: [makeIngredient()],
    steps: ['Step 1'],
    nutrition: {},
    tags: [] as string[],
    authorId: oid(),
    status: 'approved',
    favoritesCount: 0,
    save: jest.fn(),
    ...overrides,
  };
  recipe.save = (overrides.save as jest.Mock) ?? jest.fn().mockResolvedValue(recipe);
  return recipe;
}

type PantryItemInput = {
  foodId?: Types.ObjectId;
  name?: string;
  quantity?: number;
  unit?: string;
  expiryDate?: Date;
  status?: string;
  familyId?: Types.ObjectId;
};

/** Lean pantry item, as consumed by suggestion / missing-ingredient logic. */
export function makePantryItem(input: PantryItemInput = {}) {
  return {
    _id: oid(),
    familyId: input.familyId ?? oid(),
    foodId: input.foodId,
    name: input.name ?? 'Tomato',
    quantity: input.quantity ?? 5,
    unit: input.unit ?? 'pcs',
    expiryDate: input.expiryDate ?? new Date('2099-01-01'),
    status: input.status ?? 'active',
  };
}
