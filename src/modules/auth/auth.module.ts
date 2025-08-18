import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { APP_CONFIGS } from '../../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: APP_CONFIGS.JWT.SECRET,
      signOptions: {
        expiresIn: APP_CONFIGS.JWT.TOKEN_EXPIRY,
      },
    }),
    UsersModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
