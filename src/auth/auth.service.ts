import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { UserDto } from './dto/user.dto';

import {
  INVALID_TOKEN,
  SIGNUP_OR_LOGIN,
  UNAUTHORIZED,
  WRONG_EMAIL,
} from './constants/errors.constants';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password }: UserDto) {
    const user = await this.UserModel.findOne({ email });

    if (user) throw new BadRequestException(WRONG_EMAIL);

    const newUser = await this.UserModel.create({
      email,
      password: await this.getHashedPassword(password),
    });

    return this.getUserWithToken(newUser);
  }

  async login({ email, password }: UserDto) {
    const user = await this.UserModel.findOne({ email });

    if (!user) throw new UnauthorizedException(UNAUTHORIZED);

    const isPasswordCorrect = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordCorrect) throw new UnauthorizedException(UNAUTHORIZED);

    return this.getUserWithToken(user);
  }

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

  async getHashedPassword(password: string) {
    return hash(password, await genSalt(12));
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
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
}
