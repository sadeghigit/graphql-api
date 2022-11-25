import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginateInput } from 'src/common/input-types/paginate.input';
import { ParseIdPipe } from 'src/common/parse-id.pipe';
import { SearchSessionInput } from 'src/sessions/input-types/search-session.input';
import { Session } from 'src/sessions/schemas/session.schema';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateUserInput } from './input-types/create-user.input';
import { SearchUserInput } from './input-types/search-users.input';
import { UpdateUserInput } from './input-types/update-user.input';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async getUsers(
    @Args('searchUserInput') searchUserInput: SearchUserInput,
    @Args('paginateInput') paginateInput: PaginateInput,
  ): Promise<User[]> {
    return await this.usersService.getUsers(searchUserInput, paginateInput);
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getUsersCount(
    @Args('searchUserInput') searchUserInput: SearchUserInput,
  ): Promise<number> {
    return await this.usersService.getUsersCount(searchUserInput);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getUser(
    @Args('id', { type: () => ID }, ParseIdPipe) id: Types.ObjectId,
  ): Promise<User | null> {
    return await this.usersService.getUser(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(createUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }, ParseIdPipe) id: Types.ObjectId,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<boolean> {
    return await this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeUser(
    @Args('id', { type: () => ID }, ParseIdPipe) id: Types.ObjectId,
  ): Promise<boolean> {
    return await this.usersService.removeUser(id);
  }

  @ResolveField()
  @UseGuards(GqlAuthGuard)
  async sessions(@Parent() user: User): Promise<Session[]> {
    const searchInput: SearchSessionInput = { user: [user._id.toHexString()] };
    return await this.sessionsService.getSessions(searchInput);
  }
}
