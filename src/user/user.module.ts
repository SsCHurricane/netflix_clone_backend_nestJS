import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserHelpersModule } from '@helpers/userHelpers/user.helpers.module';
import { UserHelpersService } from '@helpers/userHelpers/user.helpers.service';

@Module({
	imports: [UserHelpersModule],

	controllers: [UserController],
	providers: [UserService, UserHelpersService],
})
export class UserModule {}
