import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NaviMart API')
    .setDescription(
      [
        'Backend API for shopping lists, pantry management, meal planning, family sharing, and reports.',
        '',
        'Authentication uses JWT bearer tokens. Call `POST /api/auth/login` or `POST /api/auth/register`, then paste the returned `accessToken` into Authorize.',
        'Most business endpoints require the user to belong to a family and may require family permissions such as `edit_lists`, `edit_pantry`, `edit_meals`, `manage_family`, or `view_reports`.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local development')
    .addTag('Health', 'Service health checks.')
    .addTag('Admin', 'Admin-only user, catalog, recipe moderation, and stats management.')
    .addTag(
      'Auth',
      'Register, login, refresh token rotation, logout, password reset, and email verification.',
    )
    .addTag('Catalog', 'Public read access to food catalog, categories, and units.')
    .addTag('Family', 'Family creation, invite sharing, member management, and permissions.')
    .addTag('Shopping Lists', 'Shopping list CRUD, item CRUD, and completion into pantry.')
    .addTag('Pantry', 'Pantry inventory CRUD, consume, waste, and expiry status filtering.')
    .addTag('Notifications', 'User notification inbox and read state management.')
    .addTag('Recipes', 'Recipe search, detail, CRUD, missing ingredients, and generated shopping lists.')
    .addTag('Meals', 'Meal planner CRUD, missing ingredients, and generated shopping lists.')
    .addTag('Reports', 'Dashboard, consumption trend, and waste reports.')
    .addTag('Uploads', 'Authenticated image uploads backed by Cloudinary.')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the accessToken returned by auth endpoints.',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace('Controller', '')}_${methodKey}`,
  });
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customSiteTitle: 'NaviMart API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
