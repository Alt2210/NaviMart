import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  createMockModel,
  MockModel,
  mockQuery,
} from '../../test/utils/mock-model';
import { makeFamily, makeRecipe, makeUser, oid } from '../../test/utils/fixtures';
import { MealsService } from './meals.service';

function makeMealDoc(overrides: Record<string, unknown> = {}) {
  const doc = {
    _id: oid(),
    familyId: oid(),
    date: new Date('2026-06-13'),
    session: 'dinner',
    customSessionName: undefined,
    recipeId: undefined as Types.ObjectId | undefined,
    customName: undefined,
    servings: 2,
    isCompleted: false,
    note: undefined,
    createdBy: oid(),
    save: jest.fn(),
    deleteOne: jest.fn(),
    ...overrides,
  };
  doc.save = (overrides.save as jest.Mock) ?? jest.fn().mockResolvedValue(doc);
  doc.deleteOne =
    (overrides.deleteOne as jest.Mock) ?? jest.fn().mockResolvedValue(doc);
  return doc;
}

describe('MealsService', () => {
  let service: MealsService;
  let mealPlanModel: MockModel;
  let familyModel: MockModel;
  let recipeModel: MockModel;
  let missingIngredientsService: { getRecipeMissingIngredients: jest.Mock };
  let shoppingListGenerationService: { generateFromMeal: jest.Mock };
  let user: ReturnType<typeof makeUser>;

  beforeEach(() => {
    mealPlanModel = createMockModel();
    familyModel = createMockModel();
    recipeModel = createMockModel();
    missingIngredientsService = {
      getRecipeMissingIngredients: jest.fn().mockResolvedValue({ ok: true }),
    };
    shoppingListGenerationService = {
      generateFromMeal: jest.fn().mockResolvedValue({ ok: true }),
    };
    user = makeUser();

    familyModel.findById.mockReturnValue(
      mockQuery(
        makeFamily({
          members: [
            { userId: new Types.ObjectId(user.userId), status: 'active' },
          ],
        }),
      ),
    );

    service = new MealsService(
      mealPlanModel as never,
      familyModel as never,
      recipeModel as never,
      missingIngredientsService as never,
      shoppingListGenerationService as never,
    );
  });

  describe('findAll', () => {
    it('filters by family and date range and attaches batched recipe names', async () => {
      const recipe = makeRecipe({ name: 'Pho' });
      const meal = makeMealDoc({ recipeId: recipe._id });
      const findQuery = mockQuery([meal]);
      mealPlanModel.find.mockReturnValue(findQuery);
      recipeModel.find.mockReturnValue(
        mockQuery([{ _id: recipe._id, name: 'Pho' }]),
      );

      const result = await service.findAll(user, {
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-06-30'),
      } as never);

      const filter = mealPlanModel.find.mock.calls[0][0];
      expect(filter.date).toEqual({
        $gte: new Date('2026-06-01'),
        $lte: new Date('2026-06-30'),
      });
      expect(findQuery.sort).toHaveBeenCalledWith({ date: 1, session: 1 });
      expect(result[0].recipeName).toBe('Pho');
    });
  });

  describe('create', () => {
    it('throws NotFound when the referenced recipe is missing', async () => {
      recipeModel.findOne.mockReturnValue(mockQuery(null));
      await expect(
        service.create(user, {
          date: new Date(),
          session: 'lunch',
          recipeId: oid().toString(),
        } as never),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('defaults servings from the recipe when omitted', async () => {
      const recipe = makeRecipe({ servings: 4 });
      recipeModel.findOne.mockReturnValue(mockQuery(recipe));
      const created = makeMealDoc({ recipeId: recipe._id, servings: 4 });
      mealPlanModel.create.mockResolvedValue(created);

      await service.create(user, {
        date: new Date(),
        session: 'dinner',
        recipeId: recipe._id.toString(),
      } as never);

      const createArg = mealPlanModel.create.mock.calls[0][0];
      expect(createArg.servings).toBe(4);
    });
  });

  describe('getMissingIngredients', () => {
    it('throws BadRequest when the meal has no recipe', async () => {
      mealPlanModel.findOne.mockReturnValue(
        mockQuery(makeMealDoc({ recipeId: undefined })),
      );
      await expect(
        service.getMissingIngredients(user, oid().toString()),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('delegates to the missing-ingredients service with the meal servings', async () => {
      const recipeId = oid();
      mealPlanModel.findOne.mockReturnValue(
        mockQuery(makeMealDoc({ recipeId, servings: 3 })),
      );

      await service.getMissingIngredients(user, oid().toString());

      expect(
        missingIngredientsService.getRecipeMissingIngredients,
      ).toHaveBeenCalledWith(user, recipeId.toString(), 3);
    });
  });

  describe('generateShoppingList', () => {
    it('throws BadRequest when the meal has no recipe', async () => {
      mealPlanModel.findOne.mockReturnValue(
        mockQuery(makeMealDoc({ recipeId: undefined })),
      );
      await expect(
        service.generateShoppingList(user, oid().toString(), {} as never),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('delegates to the generation service using the meal date as plannedFor', async () => {
      const recipeId = oid();
      const meal = makeMealDoc({ recipeId, servings: 2, date: new Date('2026-07-01') });
      mealPlanModel.findOne.mockReturnValue(mockQuery(meal));

      await service.generateShoppingList(user, oid().toString(), {} as never);

      expect(shoppingListGenerationService.generateFromMeal).toHaveBeenCalledWith(
        user,
        recipeId.toString(),
        2,
        expect.objectContaining({ plannedFor: meal.date }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFound when the meal is not in the family', async () => {
      mealPlanModel.findOne.mockReturnValue(mockQuery(null));
      await expect(
        service.findOne(user, oid().toString()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns the meal with its looked-up recipe name', async () => {
      const recipeId = oid();
      mealPlanModel.findOne.mockReturnValue(
        mockQuery(makeMealDoc({ recipeId })),
      );
      recipeModel.findById.mockReturnValue(mockQuery({ name: 'Bun bo' }));

      const result = await service.findOne(user, oid().toString());
      expect(result.recipeName).toBe('Bun bo');
    });
  });

  describe('update', () => {
    it('updates simple fields and persists the meal', async () => {
      const meal = makeMealDoc({ recipeId: undefined, servings: 2 });
      mealPlanModel.findOne.mockReturnValue(mockQuery(meal));

      await service.update(user, meal._id.toString(), {
        servings: 5,
        isCompleted: true,
      } as never);

      expect(meal.servings).toBe(5);
      expect(meal.isCompleted).toBe(true);
      expect(meal.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the meal plan', async () => {
      const meal = makeMealDoc();
      mealPlanModel.findOne.mockReturnValue(mockQuery(meal));
      const result = await service.remove(user, meal._id.toString());
      expect(meal.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
