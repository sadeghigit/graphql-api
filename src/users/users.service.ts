import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginateInput } from 'src/common/input-types/paginate.input';
import { CreateUserInput } from './input-types/create-user.input';
import { SearchUserInput } from './input-types/search-users.input';
import { UpdateUserInput } from './input-types/update-user.input';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    await this.duplicateCheck(createUserInput.mobile);
    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    return await this.userModel.create(createUserInput);
  }

  async getUsers(
    searchUserInput: SearchUserInput,
    paginateInput: PaginateInput,
  ): Promise<User[]> {
    const where = this.searchInputToWhere(searchUserInput);
    return await this.userModel
      .find(where)
      .sort({ [paginateInput.sort]: paginateInput.sortDir })
      .skip(paginateInput.perPage * (paginateInput.page - 1))
      .limit(paginateInput.perPage)
      .lean();
  }

  async getUsersCount(searchUserInput: SearchUserInput): Promise<number> {
    const where = this.searchInputToWhere(searchUserInput);
    return await this.userModel.countDocuments(where);
  }

  async getUser(id: Types.ObjectId): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async getUserByMobile(mobile: string): Promise<User | null> {
    return await this.userModel.findOne({ mobile });
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ): Promise<boolean> {
    if (updateUserInput.mobile)
      await this.duplicateCheck(updateUserInput.mobile, id);
    if (updateUserInput.password)
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    const result = await this.userModel.updateOne({ _id: id }, updateUserInput);
    return result.modifiedCount === 1;
  }

  async removeUser(id: Types.ObjectId): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  searchInputToWhere(searchUserInput: SearchUserInput) {
    const where: any = {};
    if (searchUserInput.mobile) {
      where.mobile = { $regex: searchUserInput.mobile };
    }
    if (searchUserInput.name) {
      where.name = { $regex: searchUserInput.name };
    }
    if (searchUserInput.role) {
      where.role = { $in: searchUserInput.role };
    }
    if (searchUserInput.createdAt) {
      const date = searchUserInput.createdAt;
      where.createdAt = { $gte: date[0], $lte: date[1] };
    }
    if (searchUserInput.updatedAt) {
      const date = searchUserInput.updatedAt;
      where.updatedAt = { $gte: date[0], $lte: date[1] };
    }
    return where;
  }

  async duplicateCheck(mobile: string, id?: Types.ObjectId): Promise<void> {
    const where: any = { mobile, _id: { $ne: id } };
    const count = await this.userModel.countDocuments(where);
    if (count > 0) throw new BadRequestException();
  }
}
