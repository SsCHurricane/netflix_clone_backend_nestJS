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

import { UNAUTHORIZED, WRONG_EMAIL } from './constants/errors.constants';
import { JwtService } from '@nestjs/jwt';

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

    const tokens = await this.generateTokensPair(String(newUser._id));

    return {
      user: this.getReturningUserFields(newUser),
      ...tokens,
    };
  }

  async login({ email, password }: UserDto) {
    const user = await this.UserModel.findOne({ email });

    if (!user) throw new UnauthorizedException(UNAUTHORIZED);

    const isPasswordCorrect = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordCorrect) throw new UnauthorizedException(UNAUTHORIZED);

    const tokens = await this.generateTokensPair(String(user._id));

    return {
      user: this.getReturningUserFields(user),
      ...tokens,
    };
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

  getReturningUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
    };
  }
}
