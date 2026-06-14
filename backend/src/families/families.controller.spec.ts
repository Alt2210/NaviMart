import { makeUser } from '../../test/utils/fixtures';
import { FamiliesController } from './families.controller';

describe('FamiliesController', () => {
  let controller: FamiliesController;
  let familiesService: Record<string, jest.Mock>;
  const user = makeUser();

  beforeEach(() => {
    familiesService = {
      getCurrentFamily: jest.fn().mockResolvedValue({ id: 'f1' }),
      create: jest.fn().mockResolvedValue({ id: 'f1' }),
      createInvite: jest.fn().mockResolvedValue({ inviteCode: 'X' }),
      join: jest.fn().mockResolvedValue({ id: 'f1' }),
      updateMemberPermissions: jest.fn().mockResolvedValue({ id: 'f1' }),
      removeMember: jest.fn().mockResolvedValue({ success: true }),
    };
    controller = new FamiliesController(familiesService as never);
  });

  it('forwards current-family read and create', async () => {
    await controller.getCurrentFamily(user);
    expect(familiesService.getCurrentFamily).toHaveBeenCalledWith(user);

    const dto = { name: 'Fam' };
    await controller.create(user, dto as never);
    expect(familiesService.create).toHaveBeenCalledWith(user, dto);
  });

  it('forwards invite and join', async () => {
    await controller.createInvite(user, { permissions: ['edit_lists'] } as never);
    expect(familiesService.createInvite).toHaveBeenCalled();

    await controller.join(user, { inviteCode: 'X' } as never);
    expect(familiesService.join).toHaveBeenCalledWith(user, { inviteCode: 'X' });
  });

  it('forwards member permission update and removal with the member id', async () => {
    const dto = { permissions: ['manage_pantry'] };
    await controller.updateMemberPermissions(user, 'm1', dto as never);
    expect(familiesService.updateMemberPermissions).toHaveBeenCalledWith(
      user,
      'm1',
      dto,
    );

    await controller.removeMember(user, 'm1');
    expect(familiesService.removeMember).toHaveBeenCalledWith(user, 'm1');
  });
});
