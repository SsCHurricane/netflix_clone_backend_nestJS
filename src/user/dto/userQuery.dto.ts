import { Type } from 'class-transformer';
import {
	IsIn,
	IsInt,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';

export class SearchDto {
	@IsString({ each: true })
	fields: string[];

	@IsString()
	term: string;
}

export class SortDto {
	@IsOptional()
	@IsString()
	by?: string;

	@IsOptional()
	@IsIn(['1', '-1'])
	order?: 1 | -1;
}
export class PaginationDto {
	@IsInt()
	@Type(() => Number)
	@Min(1)
	page: number;

	@IsInt()
	@Type(() => Number)
	@Min(1)
	limit: number;
}

export class UserQueryDto {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SearchDto)
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
