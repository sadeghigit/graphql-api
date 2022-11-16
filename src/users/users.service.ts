import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SearchUserInput } from './search-users.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(input: CreateUserInput): Promise<User> {
    await this.duplicateCheck(input.mobile);
    input.password = await bcrypt.hash(input.password, 10);
    return await this.userModel.create(input);
  }

  async getUsers(input: SearchUserInput): Promise<User[]> {
    const where = this.searchInputToWhere(input);
    return await this.userModel.find(where).lean();
  }

  async getUsersCount(input: SearchUserInput): Promise<number> {
    const where = this.searchInputToWhere(input);
    return await this.userModel.countDocuments(where);
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }
  async getUserByMobile(mobile: string): Promise<User | null> {
    return await this.userModel.findOne({ mobile });
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<boolean> {
    if (input.mobile) await this.duplicateCheck(input.mobile, id);
    if (input.password) input.password = await bcrypt.hash(input.password, 10);
    const result = await this.userModel.updateOne({ _id: id }, input);
    return result.modifiedCount === 1;
  }

  async removeUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  searchInputToWhere(searchInput: SearchUserInput) {
    const where: any = {};
    if (searchInput.mobile) {
      where.mobile = { $regex: searchInput.mobile };
    }
    if (searchInput.role) {
      where.role = { $in: searchInput.role };
    }
    if (searchInput.createdAt) {
      const date = searchInput.createdAt;
      where.createdAt = { $gte: date[0], $lte: date[1] };
    }
    if (searchInput.updatedAt) {
      const date = searchInput.updatedAt;
      where.updatedAt = { $gte: date[0], $lte: date[1] };
    }
    return where;
  }

  async duplicateCheck(mobile: string, id?: string): Promise<void> {
    const where: any = { mobile, _id: { $ne: id } };
    const count = await this.userModel.countDocuments(where);
    if (count > 0) throw new BadRequestException();
  }
}
