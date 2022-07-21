import { INVALID_ROLE } from '@constants/errors.constants';
import {
	ArrayMinSize,
	IsArray,
	IsEmail,
	IsIn,
	IsMongoId,
	IsOptional,
	IsString,
	MinLength,
	ValidateNested,
} from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	email: string;

	@IsOptional()
	@MinLength(6, {
		message: 'Password cannot be less than 6 characters',
	})
	@IsString()
	password?: string;
}

const roles = ['admin', 'moderator', 'user'];
type roleType = 'admin' | 'moderator' | 'user';

export class UpdateUserRole {
	@IsString()
	@IsIn(roles, {
		message: INVALID_ROLE,
	})
	role: roleType;

	@IsMongoId()
	_id: string;
}

export class DeleteUserDto {
	@ArrayMinSize(1)
	@IsMongoId({ each: true })
	ids: string[];
}
