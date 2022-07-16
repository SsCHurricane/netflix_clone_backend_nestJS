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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
  ) {}

  async register({ email, password }: UserDto) {
    const user = await this.UserModel.findOne({ email });

    if (user) throw new BadRequestException(WRONG_EMAIL);

    return await this.UserModel.create({
      email,
      password: await this.getHashedPassword(password),
    });
  }

  async login({ email, password }: UserDto) {
    const user = await this.UserModel.findOne({ email });

    if (!user) throw new UnauthorizedException(UNAUTHORIZED);

    const isPasswordCorrect = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordCorrect) throw new UnauthorizedException(UNAUTHORIZED);

    return user;
  }

  async getHashedPassword(password: string) {
    return hash(password, await genSalt(9));
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}
