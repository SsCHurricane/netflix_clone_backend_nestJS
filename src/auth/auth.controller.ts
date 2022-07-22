import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	register(@Body() dto: UserDto) {
		return this.authService.register(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('login')
	@HttpCode(200)
	login(@Body() dto: UserDto) {
		return this.authService.login(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('access-token')
	@HttpCode(200)
	getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto);
	}
}
