import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './input-types/create-user.input';
import { UpdateUserInput } from './input-types/update-user.input';
import { Types } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, Role } from '../auth/auth.guard';
import { UserRole } from './schemas/user-role.enum';
import { CurrentUser } from '../auth/current-user';
import { JwtPayload } from '../auth/jwt-payload';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser(input)
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers()
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Query(() => Int)
  async getUsersCount(): Promise<number> {
    return this.usersService.getUsersCount()
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Query(() => User)
  async getUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
  ): Promise<User> {
    return this.usersService.getUser(id)
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
    @Args('input') input: UpdateUserInput,
  ): Promise<boolean> {
    return this.usersService.updateUser(id, input)
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: Types.ObjectId,
    @CurrentUser() jwt: JwtPayload
  ): Promise<boolean> {
    return this.usersService.deleteUser(id, jwt)
  }
}
