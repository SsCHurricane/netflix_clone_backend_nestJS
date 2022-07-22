import { Type } from 'class-transformer';
import {
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class SearchDto {
	@IsString({ each: true })
	fields: string[];

	@IsString()
	term: string;
}

export class SortDto {
	@IsString()
	by: string;

	@IsIn([1, -1])
	order: 1 | -1;
}
export class PaginationDto {
	@IsNumber()
	page: number;

	@IsNumber()
	limit: number;
}

export class UserQueryDto {
	@IsOptional()
	@ValidateNested({ each: true })
	@IsString()
	search?: SearchDto;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SortDto)
	sort?: SortDto;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => PaginationDto)
	pagination?: PaginationDto;
}
