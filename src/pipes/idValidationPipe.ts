import { INVALID_ID_FORMAT } from '@constants/user.constants';
import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class idValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') return value;

		if (!Types.ObjectId.isValid(value))
			throw new BadRequestException(INVALID_ID_FORMAT);

		return value;
	}
}
