import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '@user/user.model';
import { UserDto } from './dto/user.dto';
import { UNAUTHORIZED, WRONG_EMAIL } from '@constants/errors.constants';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { comparePasswords, getHashedPassword } from '@helpers/password.helpers';
import { UserHelpersService } from '@helpers/userHelpers/user.helpers.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly UserHelpersService: UserHelpersService,
	) {}

	async register({ email, password }: UserDto) {
		const user = await this.UserModel.findOne({ email });

		if (user) throw new BadRequestException(WRONG_EMAIL);

		const newUser = await this.UserModel.create({
			email,
			password: await getHashedPassword(password),
		});

		return this.UserHelpersService.getUserWithToken(newUser);
	}

	async login({ email, password }: UserDto) {
		const user = await this.UserModel.findOne({ email });

		if (!user) throw new UnauthorizedException(UNAUTHORIZED);

		const isPasswordCorrect = await comparePasswords(password, user.password);

		if (!isPasswordCorrect) throw new UnauthorizedException(UNAUTHORIZED);

		return this.UserHelpersService.getUserWithToken(user);
	}

	async getNewTokens(dto: RefreshTokenDto) {
		return this.UserHelpersService.getNewTokens(dto);
	}
}
