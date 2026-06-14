import { makeUser } from '../../test/utils/fixtures';
import { RecipesController } from './recipes.controller';

describe('RecipesController', () => {
  let controller: RecipesController;
  let recipesService: Record<string, jest.Mock>;
  const user = makeUser();

  beforeEach(() => {
    recipesService = {
      findAll: jest.fn().mockResolvedValue([]),
      getSuggestions: jest.fn().mockResolvedValue([]),
      findFavorites: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: '1' }),
      addFavorite: jest.fn().mockResolvedValue({ isFavorite: true }),
      removeFavorite: jest.fn().mockResolvedValue({ isFavorite: false }),
      getMissingIngredients: jest.fn().mockResolvedValue({}),
      generateShoppingList: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({ id: '1' }),
      update: jest.fn().mockResolvedValue({ id: '1' }),
      remove: jest.fn().mockResolvedValue({ success: true }),
    };
    controller = new RecipesController(recipesService as never);
  });

  it('forwards list/suggestion/favorite reads', async () => {
    await controller.findAll(user, { q: 'pho' } as never);
    expect(recipesService.findAll).toHaveBeenCalledWith(user, { q: 'pho' });

    await controller.getSuggestions(user, { limit: 5 } as never);
    expect(recipesService.getSuggestions).toHaveBeenCalledWith(user, { limit: 5 });

    await controller.findFavorites(user);
    expect(recipesService.findFavorites).toHaveBeenCalledWith(user);
  });

  it('unwraps the servings query for missing ingredients', async () => {
    await controller.getMissingIngredients(user, 'r1', { servings: 4 } as never);
    expect(recipesService.getMissingIngredients).toHaveBeenCalledWith(
      user,
      'r1',
      4,
    );
  });

  it('forwards favorite mutations with the recipe id', async () => {
    await controller.addFavorite(user, 'r1');
    expect(recipesService.addFavorite).toHaveBeenCalledWith(user, 'r1');

    await controller.removeFavorite(user, 'r1');
    expect(recipesService.removeFavorite).toHaveBeenCalledWith(user, 'r1');
  });

  it('forwards create/update/remove', async () => {
    const dto = { name: 'New' };
    await controller.create(user, dto as never);
    expect(recipesService.create).toHaveBeenCalledWith(user, dto);

    await controller.update(user, 'r1', dto as never);
    expect(recipesService.update).toHaveBeenCalledWith(user, 'r1', dto);

    await controller.remove(user, 'r1');
    expect(recipesService.remove).toHaveBeenCalledWith(user, 'r1');
  });
});
