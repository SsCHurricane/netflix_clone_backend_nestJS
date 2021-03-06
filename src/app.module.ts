import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from '../configs/mongo.config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserHelpersService } from './helpers/userHelpers/user.helpers.service';
import { UserHelpersModule } from './helpers/userHelpers/user.helpers.module';
import { MongoHelpersModule } from './helpers/mongo-helpers/mongo-helpers.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		UserModule,
		UserHelpersModule,
		MongoHelpersModule,
	],
	controllers: [AppController],
	providers: [AppService, UserHelpersService],
})
export class AppModule {}
