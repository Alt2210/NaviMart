import { makeUser } from '../../test/utils/fixtures';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Record<string, jest.Mock>;

  beforeEach(() => {
    authService = {
      register: jest.fn().mockResolvedValue({ user: {}, tokens: {} }),
      login: jest.fn().mockResolvedValue({ user: {}, tokens: {} }),
      refresh: jest.fn().mockResolvedValue({ tokens: {} }),
      logout: jest.fn().mockResolvedValue({ success: true }),
      forgotPassword: jest.fn().mockResolvedValue({ success: true }),
      resetPassword: jest.fn().mockResolvedValue({ success: true }),
      sendVerification: jest.fn().mockResolvedValue({ success: true }),
      verifyEmail: jest.fn().mockResolvedValue({ success: true }),
    };
    controller = new AuthController(authService as never);
  });

  it('register / login forward the dto', async () => {
    const registerDto = { email: 'a@b.com', password: 'p' };
    await controller.register(registerDto as never);
    expect(authService.register).toHaveBeenCalledWith(registerDto);

    const loginDto = { identifier: 'a@b.com', password: 'p' };
    await controller.login(loginDto as never);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('refresh unwraps the refreshToken from the dto', async () => {
    await controller.refresh({ refreshToken: 'tok' } as never);
    expect(authService.refresh).toHaveBeenCalledWith('tok');
  });

  it('logout / sendVerification forward the current user', async () => {
    const user = makeUser();
    await controller.logout(user);
    expect(authService.logout).toHaveBeenCalledWith(user);

    await controller.sendVerification(user);
    expect(authService.sendVerification).toHaveBeenCalledWith(user);
  });

  it('forgotPassword / resetPassword / verifyEmail forward the dto', async () => {
    await controller.forgotPassword({ identifier: 'a@b.com' } as never);
    expect(authService.forgotPassword).toHaveBeenCalled();

    await controller.resetPassword({ token: 't', newPassword: 'p' } as never);
    expect(authService.resetPassword).toHaveBeenCalled();

    await controller.verifyEmail({ token: 't' } as never);
    expect(authService.verifyEmail).toHaveBeenCalled();
  });
});
