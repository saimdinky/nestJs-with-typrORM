import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { APP_CONFIGS } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LoggerModule } from './modules/logger/logger.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CustomLoggerService } from './modules/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: APP_CONFIGS.DB.TYPE as 'postgres',
      host: APP_CONFIGS.DB.DB_HOST,
      port: APP_CONFIGS.DB.DB_PORT,
      username: APP_CONFIGS.DB.DB_USER,
      password: APP_CONFIGS.DB.DB_PASSWORD,
      database: APP_CONFIGS.DB.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
      synchronize: APP_CONFIGS.DB.SYNCHRONIZE,
      logging: APP_CONFIGS.ENV === 'development',
      logger: 'advanced-console',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: +APP_CONFIGS.RATE_LIMIT.TTL * 1000, // Convert to milliseconds
        limit: +APP_CONFIGS.RATE_LIMIT.LIMIT,
      },
    ]),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CustomLoggerService,
  ],
})
export class AppModule {}
