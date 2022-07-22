import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongoHelpersModule } from '@helpers/mongo-helpers/mongo-helpers.module';
import { MongoHelpersService } from '@helpers/mongo-helpers/mongo-helpers.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: { collection: 'User' },
			},
		]),
		MongoHelpersModule,
	],

	controllers: [UserController],
	providers: [UserService, MongoHelpersService],
})
export class UserModule {}
