import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export function createMongooseOptions(
  configService: ConfigService,
): MongooseModuleOptions {
  return {
    uri: configService.getOrThrow<string>('MONGODB_URI'),
    dbName: configService.get<string>('MONGODB_DB_NAME'),
    autoIndex: configService.get<string>('NODE_ENV') !== 'production',
  };
}
