import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './input-types/create-user.input';
import { UpdateUserInput } from './input-types/update-user.input';
import { Types } from 'mongoose';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Mutation(() => User)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser(input)
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers()
  }

  @Query(() => Int)
  async getUsersCount(): Promise<number> {
    return this.usersService.getUsersCount()
  }

  @Query(() => User)
  async getUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
  ): Promise<User> {
    return this.usersService.getUser(id)
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
    @Args('input') input: UpdateUserInput,
  ): Promise<boolean> {
    return this.usersService.updateUser(id, input)
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
  ): Promise<boolean> {
    return this.usersService.deleteUser(id)
  }
}
