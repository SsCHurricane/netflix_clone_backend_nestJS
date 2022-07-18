import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoleType } from '../auth.interface';
import { AdminGuard } from '../guards/admin.guard';
import { JWTAuthGuard } from '../guards/jwt.guard';

export const Auth = (role: UserRoleType = 'user') =>
  applyDecorators(
    role == 'admin'
      ? UseGuards(JWTAuthGuard, AdminGuard)
      : UseGuards(JWTAuthGuard),
  );
