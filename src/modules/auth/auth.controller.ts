import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserReq } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { api } from '../../contracts';
import { User } from '../users/entities/user.entity';
import { CustomLoggerService } from '../logger/logger.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @TsRestHandler(api.auth.login)
  async login(@UserReq() user: User) {
    return tsRestHandler(api.auth.login, async () => {
      try {
        const response = await this.authService.login(user);
        return { status: HttpStatus.OK, body: response };
      } catch (error) {
        this.logger.error('Login error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: { message: 'Login failed', statusCode: 400 },
        };
      }
    });
  }

  @Public()
  @TsRestHandler(api.auth.register)
  async register() {
    return tsRestHandler(api.auth.register, async ({ body }) => {
      try {
        const response = await this.authService.register(body);
        return { status: HttpStatus.CREATED, body: response };
      } catch (error) {
        this.logger.error('Registration error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Registration failed',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.auth.profile)
  async getProfile(@UserReq() user: User) {
    return tsRestHandler(api.auth.profile, async () => {
      try {
        const profile = await this.authService.getProfile(user.id);
        return {
          status: HttpStatus.OK,
          body: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            roles: profile.roles.map((role) => ({
              id: role.id,
              name: role.name,
              permissions:
                role.permissions?.map((permission) => ({
                  id: permission.id,
                  name: permission.name,
                  url: permission.url,
                  regex: permission.regex,
                })) || [],
            })),
          },
        };
      } catch (error) {
        this.logger.error('Get profile error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: { message: 'Failed to get profile', statusCode: 400 },
        };
      }
    });
  }

  @TsRestHandler(api.auth.changePassword)
  async changePassword(@UserReq() user: User) {
    return tsRestHandler(api.auth.changePassword, async ({ body }) => {
      try {
        await this.authService.changePassword(user.id, body);
        return {
          status: HttpStatus.OK,
          body: { message: 'Password changed successfully' },
        };
      } catch (error) {
        this.logger.error('Change password error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to change password',
            statusCode: 400,
          },
        };
      }
    });
  }
}
