import { Controller, HttpStatus } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RolesService } from './roles.service';
import { api } from '../../contracts';
import { CustomLoggerService } from '../logger/logger.service';

@Controller()
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly logger: CustomLoggerService,
  ) {}

  @TsRestHandler(api.roles.create)
  async create() {
    return tsRestHandler(api.roles.create, async ({ body }) => {
      try {
        const role = await this.rolesService.create(body);
        return { status: HttpStatus.CREATED, body: role };
      } catch (error) {
        this.logger.error('Create role error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to create role',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.roles.findAll)
  async findAll() {
    return tsRestHandler(api.roles.findAll, async ({ query }) => {
      try {
        const result = await this.rolesService.findAllPaginated(query);
        return { status: HttpStatus.OK, body: result };
      } catch (error) {
        this.logger.error('Find all roles error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to fetch roles',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.roles.findOne)
  async findOne() {
    return tsRestHandler(api.roles.findOne, async ({ params }) => {
      try {
        const role = await this.rolesService.findById(params.id);
        return { status: HttpStatus.OK, body: role };
      } catch (error) {
        this.logger.error('Find role error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'Role not found',
            statusCode: 404,
          },
        };
      }
    });
  }

  @TsRestHandler(api.roles.update)
  async update() {
    return tsRestHandler(api.roles.update, async ({ params, body }) => {
      try {
        const role = await this.rolesService.updateRole(params.id, body);
        return { status: HttpStatus.OK, body: role };
      } catch (error) {
        this.logger.error('Update role error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to update role',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.roles.delete)
  async delete() {
    return tsRestHandler(api.roles.delete, async ({ params }) => {
      try {
        await this.rolesService.deleteRole(params.id);
        return {
          status: HttpStatus.OK,
          body: { message: 'Role deleted successfully' },
        };
      } catch (error) {
        this.logger.error('Delete role error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'Role not found',
            statusCode: 404,
          },
        };
      }
    });
  }
}
