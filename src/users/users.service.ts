import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserInput } from './input-types/create-user.input';
import { UpdateUserInput } from './input-types/update-user.input';
import * as bcrypt from 'bcrypt'
import { match } from 'assert';
import { JwtPayload } from 'src/auth/jwt-payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createUser(input: CreateUserInput): Promise<User> {
    await this.duplicateCkeck(input.mobile)
    await this.hashPassword(input)
    const result = await this.userModel.create(input)
    return result.toObject()
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find({}, {}, { lean: true })
  }

  async getUsersCount(): Promise<number> {
    return await this.userModel.countDocuments()
  }

  async getUser(id: Types.ObjectId): Promise<User> {
    const result = await this.userModel.findById(id).orFail()
    return result.toObject()
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return await this.userModel.findOne({ mobile }, {}, { lean: true })
  }

  async updateUser(id: Types.ObjectId, input: UpdateUserInput): Promise<boolean> {
    await this.duplicateCkeck(input.mobile, id)
    await this.hashPassword(input)
    const result = await this.userModel.updateOne({ _id: id }, input)
    return result.modifiedCount == 1
  }

  async deleteUser(id: Types.ObjectId, jwt: JwtPayload): Promise<boolean> {
    if (jwt.userId.equals(id))
      throw new BadRequestException('can not delete yourself')
    const result = await this.userModel.deleteOne({ _id: id })
    return result.deletedCount == 1
  }

  async duplicateCkeck(mobile: string, id?: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findOne({ mobile, _id: { $ne: id } })
    if (user) throw new BadRequestException('mobile is duplicate')
  }

  async hashPassword(input: CreateUserInput | UpdateUserInput): Promise<void> {
    if (!input.password) return
    input.password = await bcrypt.hash(input.password, 10)
  }

  async verifyPassword(password: string, hash: string): Promise<void> {
    const match = await bcrypt.compare(password, hash)
    if (!match) throw new BadRequestException('password is invalid')
  }
}
