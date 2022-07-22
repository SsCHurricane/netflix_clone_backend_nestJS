import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserQueryDto } from '@user/dto/userQuery.dto';

@Injectable()
export class MongoHelpersService {
	async findById(Model: ModelType<any>, _id: string) {
		return await Model.findById(_id).exec();
	}

	async findOne(Model: ModelType<any>, filter: {}) {
		return await Model.findOne(filter).exec();
	}

	async findMany(
		Model: ModelType<any>,
		{ search, sort, pagination }: UserQueryDto,
	) {
		let options = {};
		const page = (pagination?.page - 1) * pagination?.limit || 0;
		const limit = pagination?.limit || 0;

		if (search?.fields && search?.term) {
			options = {
				$or: search?.fields?.map(el => {
					return { [el]: new RegExp(search.term, 'i') };
				}),
			};
		}

		const data = await Model.find(options)
			.sort({ [sort?.by ? sort?.by : 'createdAt']: sort?.order })
			.skip(page)
			.limit(limit)
			.exec();

		const totalCount = await Model.countDocuments({}).exec();
		const found = await Model.count(options).exec();

		return {
			data,
			found,
			totalCount,
			page: pagination?.page,
			lastPage: Math.ceil(found / limit),
		};
	}

	async updateOne(Model: ModelType<any>, filter: {}, newObject: {}) {
		const obj = await Model.findOne(filter);

		Object.keys(newObject).map(el => {
			obj[el] = newObject[el];
		});

		await obj.save();

		return obj;
	}

	async delete() {}
}
