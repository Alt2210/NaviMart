import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  createMockModel,
  MockModel,
  mockQuery,
} from '../../test/utils/mock-model';
import { makeFamily, makeRecipe, makeUser, oid } from '../../test/utils/fixtures';
import { ShoppingListGenerationService } from './shopping-list-generation.service';

describe('ShoppingListGenerationService', () => {
  let service: ShoppingListGenerationService;
  let familyModel: MockModel;
  let recipeModel: MockModel;
  let shoppingListModel: MockModel;
  let missingIngredientsService: { calculateMissingIngredients: jest.Mock };
  let realtimeService: { emitToFamily: jest.Mock };

  function withActiveFamily(user = makeUser()) {
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

  beforeEach(() => {
    familyModel = createMockModel();
    recipeModel = createMockModel();
    shoppingListModel = createMockModel();
    missingIngredientsService = { calculateMissingIngredients: jest.fn() };
    realtimeService = { emitToFamily: jest.fn() };

    service = new ShoppingListGenerationService(
      familyModel as never,
      recipeModel as never,
      shoppingListModel as never,
      missingIngredientsService as never,
      realtimeService as never,
    );
  });

  it('throws NotFound when the recipe is missing or archived', async () => {
    const user = withActiveFamily();
    recipeModel.findOne.mockReturnValue(mockQuery(null));

    await expect(
      service.generateFromRecipe(user, oid().toString(), {}),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(recipeModel.findOne).toHaveBeenCalledWith({
      _id: expect.anything(),
      status: { $ne: 'archived' },
    });
  });

  it('throws BadRequest when the recipe has no missing ingredients', async () => {
    const user = withActiveFamily();
    recipeModel.findOne.mockReturnValue(mockQuery(makeRecipe()));
    missingIngredientsService.calculateMissingIngredients.mockResolvedValue({
      hasMissingIngredients: false,
      missingIngredients: [],
    });

    await expect(
      service.generateFromRecipe(user, oid().toString(), {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a list from missing ingredients and broadcasts it', async () => {
    const user = withActiveFamily();
    const recipe = makeRecipe({ name: 'Pho', servings: 2 });
    recipeModel.findOne.mockReturnValue(mockQuery(recipe));

    const missingSummary = {
      hasMissingIngredients: true,
      missingIngredients: [
        {
          foodId: oid().toString(),
          categoryId: undefined,
          name: 'Beef',
          unit: 'kg',
          missingQuantity: 1.5,
        },
      ],
    };
    missingIngredientsService.calculateMissingIngredients.mockResolvedValue(
      missingSummary,
    );

    const createdList = {
      _id: oid(),
      familyId: oid(),
      name: 'Nguyen lieu cho Pho',
      type: 'custom',
      status: 'active',
      createdBy: oid(),
      items: [
        {
          _id: oid(),
          name: 'Beef',
          quantity: 1.5,
          unit: 'kg',
          status: 'pending',
        },
      ],
    };
    shoppingListModel.create.mockResolvedValue(createdList);

    const result = await service.generateFromRecipe(user, recipe._id.toString(), {
      servings: 4,
    });

    // servings override is forwarded to the calculation
    expect(
      missingIngredientsService.calculateMissingIngredients,
    ).toHaveBeenCalledWith(expect.anything(), recipe, 4);

    // the created list carries exactly the missing ingredients
    const createArg = shoppingListModel.create.mock.calls[0][0];
    expect(createArg.items).toHaveLength(1);
    expect(createArg.items[0]).toMatchObject({ name: 'Beef', quantity: 1.5 });

    expect(result.shoppingList.name).toBe('Nguyen lieu cho Pho');
    expect(result.missingSummary).toBe(missingSummary);
    expect(realtimeService.emitToFamily).toHaveBeenCalledWith(
      expect.any(String),
      'shoppingList:updated',
      expect.objectContaining({ name: 'Nguyen lieu cho Pho' }),
    );
  });

  it('defaults servings to the recipe servings when not provided', async () => {
    const user = withActiveFamily();
    const recipe = makeRecipe({ servings: 3 });
    recipeModel.findOne.mockReturnValue(mockQuery(recipe));
    missingIngredientsService.calculateMissingIngredients.mockResolvedValue({
      hasMissingIngredients: false,
      missingIngredients: [],
    });

    await expect(
      service.generateFromRecipe(user, recipe._id.toString(), {}),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(
      missingIngredientsService.calculateMissingIngredients,
    ).toHaveBeenCalledWith(expect.anything(), recipe, 3);
  });
});
