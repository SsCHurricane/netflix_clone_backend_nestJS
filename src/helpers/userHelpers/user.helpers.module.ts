import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from '@user/user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { getJwtConfigs } from '../../../configs/jwt.config';
import { UserHelpersService } from './user.helpers.service';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: { collection: 'User' },
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfigs,
		}),
	],
	exports: [JwtModule, TypegooseModule, ConfigModule],
	providers: [UserHelpersService],
})
export class UserHelpersModule {}
