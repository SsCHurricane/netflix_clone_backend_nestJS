import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from '@auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UserService } from './user.service';
import {
	DeleteUserDto,
	UpdateUserDto,
	UpdateUserRole,
} from './dto/updateUser.dto';
import { idValidationPipe } from '@pipes/idValidationPipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getUserById(@User('_id') _id: string) {
		return await this.userService.getUserById(_id);
	}

	@Patch('profile')
	@UsePipes(new ValidationPipe())
	@Auth()
	async updateUserProfile(
		@User('_id') _id: string,
		@Body() dto: UpdateUserDto,
	) {
		return await this.userService.updateUserProfile(_id, dto);
	}

	//ADMIN

	@Patch('role')
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	async updateUserRole(@Body() dto: UpdateUserRole) {
		return await this.userService.updateUserRole(dto);
	}

	@Patch(':_id')
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	async updateUser(
		@Param('_id', idValidationPipe) _id: string,
		@Body() dto: UpdateUserDto,
	) {
		return await this.userService.updateUserProfile(_id, dto);
	}

	@Get('all')
	@Auth('admin')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	@Delete('delete')
	@HttpCode(204)
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	async deleteUsers(@Body() dto: DeleteUserDto) {
		await this.userService.deleteUsers(dto);
	}
}
