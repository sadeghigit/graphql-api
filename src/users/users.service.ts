import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(input: CreateUserInput): Promise<User> {
    input.password = await bcrypt.hash(input.password, 10);
    return await this.userModel.create(input);
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().lean();
  }

  async getCount(): Promise<number> {
    return await this.userModel.countDocuments();
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<boolean> {
    if (input.password) input.password = await bcrypt.hash(input.password, 10);
    const result = await this.userModel.updateOne({ _id: id }, input);
    return result.modifiedCount === 1;
  }

  async removeUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
