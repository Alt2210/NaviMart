/**
 * Helper to spin up a single controller inside a real Nest application for
 * HTTP-level (API contract) tests — with the production-like ValidationPipe and
 * global prefix, but with guards overridden and the service mocked so no
 * MongoDB is touched.
 *
 * - authGuards: overridden by an auth-aware guard that injects `req.user` from
 *   `authState`, or throws 401 (UnauthorizedException) when `authState.user` is null.
 * - permissionGuards: overridden by a guard that throws 403 (ForbiddenException)
 *   when `permState.allow` is false (used for RBAC / family-permission tests).
 */
import {
  ExecutionContext,
  ForbiddenException,
  INestApplication,
  Type,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';

export type AuthState = { user: Record<string, unknown> | null };
export type PermState = { allow: boolean };

type Provider = { provide: unknown; useValue: unknown };

export async function createApiTestApp(config: {
  controllers: Type[];
  providers: Provider[];
  authState: AuthState;
  permState?: PermState;
  authGuards?: Type[];
  permissionGuards?: Type[];
}): Promise<INestApplication> {
  const authState = config.authState;
  const permState = config.permState ?? { allow: true };

  const authGuard = {
    canActivate: (ctx: ExecutionContext) => {
      if (!authState.user) {
        throw new UnauthorizedException();
      }
      const req = ctx.switchToHttp().getRequest();
      req.user = authState.user;
      return true;
    },
  };

  const permissionGuard = {
    canActivate: (ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      if (authState.user && !req.user) {
        req.user = authState.user;
      }
      if (!permState.allow) {
        throw new ForbiddenException();
      }
      return true;
    },
  };

  let builder: TestingModuleBuilder = Test.createTestingModule({
    controllers: config.controllers,
    providers: config.providers,
  });

  for (const guard of config.authGuards ?? []) {
    builder = builder.overrideGuard(guard).useValue(authGuard);
  }
  for (const guard of config.permissionGuards ?? []) {
    builder = builder.overrideGuard(guard).useValue(permissionGuard);
  }

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();
  return app;
}
