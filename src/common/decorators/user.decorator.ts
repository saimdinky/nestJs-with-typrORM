import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../modules/users/entities/user.entity';

export const UserReq = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
