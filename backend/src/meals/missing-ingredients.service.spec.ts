import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  createMockModel,
  MockModel,
  mockQuery,
} from '../../test/utils/mock-model';
import {
  makeFamily,
  makeIngredient,
  makePantryItem,
  makeRecipe,
  makeUser,
  oid,
} from '../../test/utils/fixtures';
import { MissingIngredientsService } from './missing-ingredients.service';

describe('MissingIngredientsService', () => {
  let service: MissingIngredientsService;
  let familyModel: MockModel;
  let pantryItemModel: MockModel;
  let recipeModel: MockModel;

  beforeEach(() => {
    familyModel = createMockModel();
    pantryItemModel = createMockModel();
    recipeModel = createMockModel();
    service = new MissingIngredientsService(
      familyModel as never,
      pantryItemModel as never,
      recipeModel as never,
    );
  });

  describe('findMatchingPantryItems', () => {
    it('matches by foodId when both sides have one and units agree', () => {
      const foodId = oid();
      const items = [
        makePantryItem({ foodId, unit: 'g' }),
        makePantryItem({ foodId: oid(), unit: 'g' }),
      ];

      const matches = service.findMatchingPantryItems(items, {
        foodId: foodId.toString(),
        name: 'anything',
        unit: 'g',
      });

      expect(matches).toHaveLength(1);
      expect(matches[0].foodId?.toString()).toBe(foodId.toString());
    });

    it('rejects matches when the unit differs', () => {
      const foodId = oid();
      const items = [makePantryItem({ foodId, unit: 'kg' })];

      expect(
        service.findMatchingPantryItems(items, {
          foodId: foodId.toString(),
          name: 'x',
          unit: 'g',
        }),
      ).toHaveLength(0);
    });

    it('falls back to case/space-insensitive name match when no foodId', () => {
      const items = [makePantryItem({ name: '  ToMaTo ', unit: 'pcs' })];

      const matches = service.findMatchingPantryItems(items, {
        name: 'tomato',
        unit: 'PCS',
      });

      expect(matches).toHaveLength(1);
    });
  });

  describe('calculateMissingIngredients', () => {
    it('scales required quantities by servings and rounds to 3 decimals', async () => {
      const recipe = makeRecipe({
        servings: 2,
        ingredients: [makeIngredient({ name: 'Rice', quantity: 1, unit: 'g' })],
      });
      pantryItemModel.find.mockReturnValue(mockQuery([]));

      const result = await service.calculateMissingIngredients(
        oid(),
        recipe as never,
        3,
      );

      expect(result.servings).toBe(3);
      // 1 * (3/2) = 1.5
      expect(result.ingredients[0].requiredQuantity).toBe(1.5);
      expect(result.ingredients[0].missingQuantity).toBe(1.5);
      expect(result.hasMissingIngredients).toBe(true);
    });

    it('ignores optional ingredients', async () => {
      const recipe = makeRecipe({
        servings: 1,
        ingredients: [
          makeIngredient({ name: 'Salt', quantity: 1, unit: 'g', optional: true }),
          makeIngredient({ name: 'Rice', quantity: 1, unit: 'g' }),
        ],
      });
      pantryItemModel.find.mockReturnValue(mockQuery([]));

      const result = await service.calculateMissingIngredients(
        oid(),
        recipe as never,
      );

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].name).toBe('Rice');
    });

    it('clamps missing quantity at 0 and reports nothing missing when stocked', async () => {
      const recipe = makeRecipe({
        servings: 1,
        ingredients: [makeIngredient({ name: 'Rice', quantity: 2, unit: 'g' })],
      });
      pantryItemModel.find.mockReturnValue(
        mockQuery([makePantryItem({ name: 'Rice', quantity: 5, unit: 'g' })]),
      );

      const result = await service.calculateMissingIngredients(
        oid(),
        recipe as never,
      );

      expect(result.ingredients[0].availableQuantity).toBe(5);
      expect(result.ingredients[0].missingQuantity).toBe(0);
      expect(result.ingredients[0].isMissing).toBe(false);
      expect(result.hasMissingIngredients).toBe(false);
      expect(result.missingIngredients).toHaveLength(0);
    });

    it('queries only active pantry items with stock for the family', async () => {
      const recipe = makeRecipe({ ingredients: [] });
      const familyId = oid();
      pantryItemModel.find.mockReturnValue(mockQuery([]));

      await service.calculateMissingIngredients(familyId, recipe as never);

      expect(pantryItemModel.find).toHaveBeenCalledWith({
        familyId,
        status: 'active',
        quantity: { $gt: 0 },
      });
    });
  });

  describe('getRecipeMissingIngredients', () => {
    function stubActiveFamily(user = makeUser()) {
      familyModel.findById.mockReturnValue(
        mockQuery(
          makeFamily({
            members: [
              { userId: new Types.ObjectId(user.userId), status: 'active' },
            ],
          }),
        ),
      );
      return user;
    }

    it('throws NotFound when the recipe does not exist', async () => {
      const user = stubActiveFamily();
      recipeModel.findById.mockReturnValue(mockQuery(null));

      await expect(
        service.getRecipeMissingIngredients(user, oid().toString()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NotFound when the recipe is archived', async () => {
      const user = stubActiveFamily();
      recipeModel.findById.mockReturnValue(
        mockQuery(makeRecipe({ status: 'archived' })),
      );

      await expect(
        service.getRecipeMissingIngredients(user, oid().toString()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns the missing summary for a visible recipe', async () => {
      const user = stubActiveFamily();
      const recipe = makeRecipe({
        servings: 1,
        ingredients: [makeIngredient({ name: 'Rice', quantity: 2, unit: 'g' })],
      });
      recipeModel.findById.mockReturnValue(mockQuery(recipe));
      pantryItemModel.find.mockReturnValue(mockQuery([]));

      const result = await service.getRecipeMissingIngredients(
        user,
        recipe._id.toString(),
      );

      expect(result.recipeName).toBe(recipe.name);
      expect(result.hasMissingIngredients).toBe(true);
    });
  });
});
