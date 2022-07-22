import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserHelpersModule } from '@helpers/userHelpers/user.helpers.module';
import { UserHelpersService } from '@helpers/userHelpers/user.helpers.service';

@Module({
	imports: [UserHelpersModule],
	controllers: [AuthController],
	providers: [AuthService, UserHelpersService, JwtStrategy],
})
export class AuthModule {}
