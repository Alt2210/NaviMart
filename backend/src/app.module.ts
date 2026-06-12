import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AiChefModule } from './ai-chef/ai-chef.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { validateEnv } from './config/env.validation';
import { createMongooseOptions } from './config/mongoose.config';
import { FamiliesModule } from './families/families.module';
import { InventoryEventsModule } from './inventory-events/inventory-events.module';
import { MealsModule } from './meals/meals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PantryModule } from './pantry/pantry.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RecipesModule } from './recipes/recipes.module';
import { ReportsModule } from './reports/reports.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createMongooseOptions,
    }),
    ScheduleModule.forRoot(),
    RealtimeModule,
    AdminModule,
    AiChefModule,
    AuthModule,
    UsersModule,
    FamiliesModule,
    InventoryEventsModule,
    CatalogModule,
    ShoppingListsModule,
    PantryModule,
    NotificationsModule,
    RecipesModule,
    MealsModule,
    ReportsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
