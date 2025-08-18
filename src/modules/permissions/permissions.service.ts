import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { BaseService } from '../../common/base.service';
import { CustomLoggerService } from '../logger/logger.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionsPaginationOptions,
  PaginatedPermissionsResponse,
} from '../../common/types/permission.types';

@Injectable()
export class PermissionsService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    protected readonly logger: CustomLoggerService,
  ) {
    super(permissionRepository, 'Permission', logger);
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      this.logger.log(
        `🌟 Creating Permission: ${JSON.stringify(createPermissionDto)}`,
      );

      // Check if permission already exists
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: createPermissionDto.name, deleted: false },
      });

      if (existingPermission) {
        throw new ConflictException('Permission with this name already exists');
      }

      // Prepare permission data
      const permissionData: DeepPartial<Permission> = {
        name: createPermissionDto.name,
        url: createPermissionDto.url,
        regex: createPermissionDto.regex,
      };

      const permission = this.permissionRepository.create(permissionData);
      const savedPermission = await this.permissionRepository.save(permission);

      this.logger.log(`✅ Created new permission: ${savedPermission.name}`);
      return savedPermission;
    } catch (error) {
      this.logger.error(
        `❌ Failed to create Permission: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create permission');
    }
  }

  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      const existingPermission = await this.findById(id);

      // Check name uniqueness if name is being updated
      if (
        updatePermissionDto.name &&
        updatePermissionDto.name !== existingPermission.name
      ) {
        const permissionWithSameName = await this.permissionRepository.findOne({
          where: { name: updatePermissionDto.name, deleted: false },
        });

        if (permissionWithSameName) {
          throw new ConflictException(
            'Permission with this name already exists',
          );
        }
      }

      // Prepare update data
      const updateData: DeepPartial<Permission> = {};
      if (updatePermissionDto.name) updateData.name = updatePermissionDto.name;
      if (updatePermissionDto.url) updateData.url = updatePermissionDto.url;
      if (updatePermissionDto.regex)
        updateData.regex = updatePermissionDto.regex;

      await this.permissionRepository.update(id, updateData);
      return this.findById(id);
    } catch (error) {
      this.logger.error(
        `❌ Failed to update permission: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update permission');
    }
  }

  async findAllPaginated(
    options: PermissionsPaginationOptions,
  ): Promise<PaginatedPermissionsResponse> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 10));
      const skip = (page - 1) * limit;

      const queryBuilder = this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.deleted = :deleted', { deleted: false })
        .andWhere('permission.enable = :enable', { enable: true });

      // Apply filters
      if (options.name) {
        queryBuilder.andWhere('LOWER(permission.name) LIKE LOWER(:name)', {
          name: `%${options.name}%`,
        });
      }

      if (options.url) {
        queryBuilder.andWhere('LOWER(permission.url) LIKE LOWER(:url)', {
          url: `%${options.url}%`,
        });
      }

      const total = await queryBuilder.getCount();
      const permissions = await queryBuilder
        .orderBy('permission.id', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        items: permissions,
        meta: {
          totalItems: total,
          itemCount: permissions.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to find permissions: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch permissions');
    }
  }

  async deletePermission(id: number): Promise<void> {
    const permission = await this.findById(id);
    await this.softDelete(id);
    this.logger.log(`Permission ${permission.name} deleted successfully`);
  }
}
