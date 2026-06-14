import { makeUser } from '../../test/utils/fixtures';
import { PantryController } from './pantry.controller';

describe('PantryController', () => {
  let controller: PantryController;
  let pantryService: Record<string, jest.Mock>;
  const user = makeUser();

  beforeEach(() => {
    pantryService = {
      findAll: jest.fn().mockResolvedValue(['item']),
      create: jest.fn().mockResolvedValue({ id: '1' }),
      findOne: jest.fn().mockResolvedValue({ id: '1' }),
      update: jest.fn().mockResolvedValue({ id: '1' }),
      remove: jest.fn().mockResolvedValue({ success: true }),
      consume: jest.fn().mockResolvedValue({ id: '1' }),
      markWasted: jest.fn().mockResolvedValue({ id: '1' }),
    };
    controller = new PantryController(pantryService as never);
  });

  it('findAll forwards the user and query', async () => {
    const query = { status: 'active' };
    await expect(controller.findAll(user, query as never)).resolves.toEqual([
      'item',
    ]);
    expect(pantryService.findAll).toHaveBeenCalledWith(user, query);
  });

  it('create forwards the user and dto', async () => {
    const dto = { name: 'Milk', quantity: 1, unit: 'l' };
    await controller.create(user, dto as never);
    expect(pantryService.create).toHaveBeenCalledWith(user, dto);
  });

  it('findOne / update / remove forward the item id', async () => {
    await controller.findOne(user, 'id1');
    expect(pantryService.findOne).toHaveBeenCalledWith(user, 'id1');

    const dto = { quantity: 2 };
    await controller.update(user, 'id1', dto as never);
    expect(pantryService.update).toHaveBeenCalledWith(user, 'id1', dto);

    await controller.remove(user, 'id1');
    expect(pantryService.remove).toHaveBeenCalledWith(user, 'id1');
  });

  it('consume / markWasted forward to the service', async () => {
    const dto = { quantity: 1 };
    await controller.consume(user, 'id1', dto as never);
    expect(pantryService.consume).toHaveBeenCalledWith(user, 'id1', dto);

    await controller.markWasted(user, 'id1');
    expect(pantryService.markWasted).toHaveBeenCalledWith(user, 'id1');
  });
});
