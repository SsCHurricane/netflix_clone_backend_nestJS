import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserModel } from '@user/user.model';

import { FORBIDDEN } from '@constants/errors.constants';

export class AdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const { user } = context.switchToHttp().getRequest<{ user: UserModel }>();

		if (user.role !== 'admin') throw new ForbiddenException(FORBIDDEN);

		return true;
	}
}
