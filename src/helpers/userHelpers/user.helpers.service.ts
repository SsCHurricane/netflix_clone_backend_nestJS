import { RefreshTokenDto } from '@auth/dto/refreshToken.dto';
import { INVALID_TOKEN, SIGNUP_OR_LOGIN } from '@constants/errors.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '@user/user.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class UserHelpersService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException(SIGNUP_OR_LOGIN);

		let res: { _id: string } = {} as { _id: string };

		try {
			const { _id } = await this.jwtService.verifyAsync(refreshToken);

			res = { _id };
		} catch (error) {
			throw new UnauthorizedException(INVALID_TOKEN);
		}

		const user = await this.UserModel.findById(res._id);

		if (!user) throw new UnauthorizedException(INVALID_TOKEN);

		return this.getUserWithToken(user);
	}

	async generateTokensPair(userId: string) {
		const data = { _id: userId };

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '30m',
		});

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		});

		return { accessToken, refreshToken };
	}

	async getUserWithToken(user: UserModel) {
		const tokens = await this.generateTokensPair(String(user._id));

		return {
			user: {
				_id: user._id,
				email: user.email,
			},
			...tokens,
		};
	}

	async getById(Model: ModelType<any>, _id: string) {
		return await Model.findById(_id).exec();
	}
}
