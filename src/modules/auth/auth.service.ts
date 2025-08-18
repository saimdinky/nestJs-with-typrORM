import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CustomLoggerService } from '../logger/logger.service';
import { User } from '../users/entities/user.entity';
import { IJwtPayload } from '../../interfaces/jwt.payload';
import {
  LoginResponse,
  RegisterDto,
  ChangePasswordDto,
} from '../../common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly logger: CustomLoggerService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        this.logger.log(`User not found for email ${email}`);
        throw new BadRequestException('Invalid credentials');
      }

      const isMatch: boolean = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        this.logger.log(`Password does not match for user ${email}`);
        throw new BadRequestException('Invalid credentials');
      }

      this.logger.log(`Valid user ${user.email} authenticated`);
      return user;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`, error.stack);
      throw new BadRequestException('Invalid credentials');
    }
  }

  async login(user: User): Promise<LoginResponse> {
    this.logger.log(`User ${user.email} logging in`);

    const userPermissions = this.getUserPermissions(user);
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      permissions: userPermissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((role) => ({
          id: role.id,
          name: role.name,
          permissions: role.permissions?.map((permission) => ({
            id: permission.id,
            name: permission.name,
            url: permission.url,
            regex: permission.regex,
          })),
        })),
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    try {
      const existingUser = await this.userService.findByEmailOptional(
        registerDto.email,
      );
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.userService.create({
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      });

      return this.login(user);
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    try {
      const user = await this.userService.findById(userId);

      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      await this.userService.updatePassword(userId, hashedNewPassword);

      this.logger.log(`Password changed successfully for user ${user.email}`);
    } catch (error) {
      this.logger.error(`Change password error: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }

  async getProfile(userId: number): Promise<User> {
    return this.userService.findById(userId);
  }

  private getUserPermissions(user: User) {
    const permissions: Record<
      string,
      {
        roleId: number;
        roleName: string;
        permission: {
          id: number;
          name: string;
          url: string;
          regex: string;
        };
      }
    > = {};

    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions[permission.url] = {
          roleId: role.id,
          roleName: role.name,
          permission: {
            id: permission.id,
            name: permission.name,
            url: permission.url,
            regex: permission.regex,
          },
        };
      });
    });

    return permissions;
  }
}
