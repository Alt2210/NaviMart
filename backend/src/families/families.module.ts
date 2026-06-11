import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { User, UserSchema } from '../users/schemas/user.schema';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { Family, FamilySchema } from './schemas/family.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Family.name, schema: FamilySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamilyPermissionGuard],
  exports: [MongooseModule, FamiliesService],
})
export class FamiliesModule {}
