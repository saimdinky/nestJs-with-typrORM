import { Controller, HttpStatus } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { UsersService } from './users.service';
import { api } from '../../contracts';
import { CustomLoggerService } from '../logger/logger.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  @TsRestHandler(api.users.create)
  async create() {
    return tsRestHandler(api.users.create, async ({ body }) => {
      try {
        const user = await this.usersService.create(body);
        return { status: HttpStatus.CREATED, body: user };
      } catch (error) {
        this.logger.error('Create user error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to create user',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.users.findAll)
  async findAll() {
    return tsRestHandler(api.users.findAll, async ({ query }) => {
      try {
        const result = await this.usersService.findAllPaginated(query);
        return { status: HttpStatus.OK, body: result };
      } catch (error) {
        this.logger.error('Find all users error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to fetch users',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.users.findOne)
  async findOne() {
    return tsRestHandler(api.users.findOne, async ({ params }) => {
      try {
        const user = await this.usersService.findById(params.id);
        return { status: HttpStatus.OK, body: user };
      } catch (error) {
        this.logger.error('Find user error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'User not found',
            statusCode: 404,
          },
        };
      }
    });
  }

  @TsRestHandler(api.users.update)
  async update() {
    return tsRestHandler(api.users.update, async ({ params, body }) => {
      try {
        const user = await this.usersService.updateUser(params.id, body);
        return { status: HttpStatus.OK, body: user };
      } catch (error) {
        this.logger.error('Update user error:', error);
        return {
          status: HttpStatus.BAD_REQUEST,
          body: {
            message: error.message || 'Failed to update user',
            statusCode: 400,
          },
        };
      }
    });
  }

  @TsRestHandler(api.users.delete)
  async delete() {
    return tsRestHandler(api.users.delete, async ({ params }) => {
      try {
        await this.usersService.deleteUser(params.id);
        return {
          status: HttpStatus.OK,
          body: { message: 'User deleted successfully' },
        };
      } catch (error) {
        this.logger.error('Delete user error:', error);
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            message: error.message || 'User not found',
            statusCode: 404,
          },
        };
      }
    });
  }
}
