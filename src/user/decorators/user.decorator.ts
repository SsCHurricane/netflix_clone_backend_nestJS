import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../user.model';

type UserData = keyof UserModel;

export const User = createParamDecorator(
  (data: UserData, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: UserModel }>();

    return data ? user[data] : user;
  },
);
