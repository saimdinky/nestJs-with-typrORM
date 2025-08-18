import { Controller, HttpStatus } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { PermissionsService } from './permissions.service';
import { api } from '../../contracts';
import { CustomLoggerService } from '../logger/logger.service';

@Controller()
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly logger: CustomLoggerService,
  ) {}

  @TsRestHandler(api.permissions.create)
  async create() {
    return tsRestHandler(api.permissions.create, async ({ body }) => {
      try {
        const permission = await this.permissionsService.create(body);
        return { status: HttpStatus.CREATED, body: permission };
      } catch (error) {
        this.logger.error('Create permission error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to create permission',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.permissions.findAll)
  async findAll() {
    return tsRestHandler(api.permissions.findAll, async ({ query }) => {
      try {
        const result = await this.permissionsService.findAllPaginated(query);
        return { status: HttpStatus.OK, body: result };
      } catch (error) {
        this.logger.error('Find all permissions error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to fetch permissions',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.permissions.findOne)
  async findOne() {
    return tsRestHandler(api.permissions.findOne, async ({ params }) => {
      try {
        const permission = await this.permissionsService.findById(params.id);
        return { status: HttpStatus.OK, body: permission };
      } catch (error) {
        this.logger.error('Find permission error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'Permission not found',
            statusCode: 404,
          },
        };
      }
    });
  }

  @TsRestHandler(api.permissions.update)
  async update() {
    return tsRestHandler(api.permissions.update, async ({ params, body }) => {
      try {
        const permission = await this.permissionsService.updatePermission(
          params.id,
          body,
        );
        return { status: HttpStatus.OK, body: permission };
      } catch (error) {
        this.logger.error('Update permission error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to update permission',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.permissions.delete)
  async delete() {
    return tsRestHandler(api.permissions.delete, async ({ params }) => {
      try {
        await this.permissionsService.deletePermission(params.id);
        return {
          status: HttpStatus.OK,
          body: { message: 'Permission deleted successfully' },
        };
      } catch (error) {
        this.logger.error('Delete permission error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'Permission not found',
            statusCode: 404,
          },
        };
      }
    });
  }
}
