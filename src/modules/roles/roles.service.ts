import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { BaseService } from '../../common/base.service';
import { CustomLoggerService } from '../logger/logger.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RolesPaginationOptions,
  PaginatedRolesResponse,
} from '../../common/types/role.types';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    protected readonly logger: CustomLoggerService,
  ) {
    super(roleRepository, 'Role', logger);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      this.logger.log(`🌟 Creating Role: ${JSON.stringify(createRoleDto)}`);

      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name, deleted: false },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }

      // Prepare role data
      const roleData: DeepPartial<Role> = {
        name: createRoleDto.name,
      };

      // Add permissions if provided
      if (
        createRoleDto.permissionIds &&
        createRoleDto.permissionIds.length > 0
      ) {
        const permissions = await this.permissionRepository.find({
          where: {
            id: In(createRoleDto.permissionIds),
            deleted: false,
            enable: true,
          },
        });

        if (permissions.length !== createRoleDto.permissionIds.length) {
          throw new BadRequestException('Some permissions not found');
        }

        roleData.permissions = permissions;
      }

      const role = this.roleRepository.create(roleData);
      const savedRole = await this.roleRepository.save(role);

      this.logger.log(`✅ Created new role: ${savedRole.name}`);
      return this.findById(savedRole.id);
    } catch (error) {
      this.logger.error(
        `❌ Failed to create Role: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create role');
    }
  }

  async findById(id: number): Promise<Role> {
    return super.findById(id, ['permissions']);
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.findById(id);

      // Check name uniqueness if name is being updated
      if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
        const roleWithSameName = await this.roleRepository.findOne({
          where: { name: updateRoleDto.name, deleted: false },
        });

        if (roleWithSameName) {
          throw new ConflictException('Role with this name already exists');
        }
      }

      // Prepare update data
      const updateData: DeepPartial<Role> = {};
      if (updateRoleDto.name) updateData.name = updateRoleDto.name;

      // Update permissions if provided
      if (updateRoleDto.permissionIds !== undefined) {
        if (updateRoleDto.permissionIds.length > 0) {
          const permissions = await this.permissionRepository.find({
            where: {
              id: In(updateRoleDto.permissionIds),
              deleted: false,
              enable: true,
            },
          });

          if (permissions.length !== updateRoleDto.permissionIds.length) {
            throw new BadRequestException('Some permissions not found');
          }

          updateData.permissions = permissions;
        } else {
          updateData.permissions = [];
        }
      }

      await this.roleRepository.update(id, updateData);
      return this.findById(id);
    } catch (error) {
      this.logger.error(
        `❌ Failed to update role: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update role');
    }
  }

  async findAllPaginated(
    options: RolesPaginationOptions,
  ): Promise<PaginatedRolesResponse> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 10));
      const skip = (page - 1) * limit;

      const queryBuilder = this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .where('role.deleted = :deleted', { deleted: false })
        .andWhere('role.enable = :enable', { enable: true });

      // Apply filters
      if (options.name) {
        queryBuilder.andWhere('LOWER(role.name) LIKE LOWER(:name)', {
          name: `%${options.name}%`,
        });
      }

      const total = await queryBuilder.getCount();
      const roles = await queryBuilder
        .orderBy('role.id', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        items: roles,
        meta: {
          totalItems: total,
          itemCount: roles.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to find roles: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch roles');
    }
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findById(id);
    await this.softDelete(id);
    this.logger.log(`Role ${role.name} deleted successfully`);
  }
}
