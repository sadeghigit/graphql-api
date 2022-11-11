import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(input);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Query(() => Number)
  async getCount(): Promise<number> {
    return await this.usersService.getCount();
  }

  @Query(() => User, { nullable: true })
  async getUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return await this.usersService.getUser(id);
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') input: UpdateUserInput,
  ): Promise<boolean> {
    return await this.usersService.updateUser(id, input);
  }

  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.usersService.removeUser(id);
  }
}
