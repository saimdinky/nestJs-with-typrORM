import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { BaseService } from '../../common/base.service';
import { CustomLoggerService } from '../logger/logger.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UsersPaginationOptions,
  PaginatedUsersResponse,
} from '../../common/types/user.types';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    protected readonly logger: CustomLoggerService,
  ) {
    super(userRepository, 'User', logger);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, deleted: false, enable: true },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findByEmailOptional(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deleted: false, enable: true },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findById(id: number): Promise<User> {
    return super.findById(id, ['roles', 'roles.permissions']);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.findByEmailOptional(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Prepare user data
      const userData: DeepPartial<User> = {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      };

      // Add roles if provided
      if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
        const roles = await this.roleRepository.find({
          where: { id: In(createUserDto.roleIds) },
        });
        userData.roles = roles;
      }

      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);

      return this.findById(savedUser.id);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);

      // Check email uniqueness if email is being updated
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.findByEmailOptional(
          updateUserDto.email,
        );
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Prepare update data
      const updateData: DeepPartial<User> = {};
      if (updateUserDto.name) updateData.name = updateUserDto.name;
      if (updateUserDto.email) updateData.email = updateUserDto.email;

      // Update roles if provided
      if (updateUserDto.roleIds !== undefined) {
        if (updateUserDto.roleIds.length > 0) {
          const roles = await this.roleRepository.find({
            where: { id: In(updateUserDto.roleIds) },
          });
          updateData.roles = roles;
        } else {
          updateData.roles = [];
        }
      }

      await this.roleRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.update(User, id, updateData);

          // Handle many-to-many relationship update manually if roles are provided
          if (updateData.roles !== undefined) {
            await transactionalEntityManager
              .createQueryBuilder()
              .delete()
              .from('user_roles')
              .where('user_id = :userId', { userId: id })
              .execute();

            if (updateData.roles.length > 0) {
              const userRoleInserts = updateData.roles.map((role: Role) => ({
                user_id: id,
                role_id: role.id,
              }));

              await transactionalEntityManager
                .createQueryBuilder()
                .insert()
                .into('user_roles')
                .values(userRoleInserts)
                .execute();
            }
          }
        },
      );

      return this.findById(id);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async findAllPaginated(
    options: UsersPaginationOptions,
  ): Promise<PaginatedUsersResponse> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 10));
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('roles.permissions', 'permissions')
        .where('user.deleted = :deleted', { deleted: false })
        .andWhere('user.enable = :enable', { enable: true });

      // Apply filters
      if (options.name) {
        queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
          name: `%${options.name}%`,
        });
      }

      if (options.email) {
        queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
          email: `%${options.email}%`,
        });
      }

      if (options.roleId) {
        queryBuilder.andWhere('roles.id = :roleId', { roleId: options.roleId });
      }

      const total = await queryBuilder.getCount();
      const users = await queryBuilder
        .orderBy('user.id', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        items: users,
        meta: {
          totalItems: total,
          itemCount: users.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.softDelete(id);
    this.logger.log(`User ${user.email} deleted successfully`);
  }
}
