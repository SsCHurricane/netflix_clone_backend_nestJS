import { Module } from '@nestjs/common';
import { MongoHelpersService } from './mongo-helpers.service';

@Module({
	providers: [MongoHelpersService],
})
export class MongoHelpersModule {}
