import { EMAIL_ALREADY_EXIST, USER_NOT_FOUND } from '@constants/user.constants';
import { getHashedPassword } from '@helpers/password.helpers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { async } from 'rxjs';
import {
	DeleteUserDto,
	UpdateUserDto,
	UpdateUserRole,
} from './dto/updateUser.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {}

	async getUserById(_id: string) {
		const user = await this.UserModel.findById(_id).exec();

		if (user.role == 'admin') return user;

		return { _id: user._id, email: user.email };
	}

	async updateUserProfile(_id: string, { email, password }: UpdateUserDto) {
		const user = await this.UserModel.findById(_id).exec();

		const isEmailExits = await this.UserModel.findOne({ email }).exec();

		if (isEmailExits && String(user._id) !== String(isEmailExits._id))
			throw new BadRequestException(EMAIL_ALREADY_EXIST);

		user.email = email;

		if (password) user.password = await getHashedPassword(password);

		await user.save();

		if (user.role == 'admin') return user;

		return { _id: user._id, email: user.email };
	}

	async updateUserRole({ role, _id }: UpdateUserRole) {
		const user = await this.UserModel.findById(_id).exec();

		if (!user) throw new BadRequestException(USER_NOT_FOUND(_id));

		user.role = role;

		await user.save();

		return user;
	}

	async getAllUsers() {
		return await this.UserModel.find().exec();
	}

	async deleteUsers({ ids }: DeleteUserDto) {
		const errors: { messages: string[] } = { messages: [] };

		for (let id of ids) {
			const deletedUser = await this.UserModel.findByIdAndDelete(id).exec();
			if (!deletedUser) errors.messages.push(USER_NOT_FOUND(id));
		}

		if (errors.messages.length > 0) throw new BadRequestException(errors);
	}
}
