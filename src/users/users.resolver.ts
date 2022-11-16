import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { SessionsService } from 'src/sessions/sessions.service';
import { SearchUserInput } from './search-users.input';
import { Session } from 'src/sessions/session.schema';
import { SearchSessionInput } from 'src/sessions/search-session.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  async getProfile(@CurrentUser() user: JwtPayload): Promise<User | null> {
    return await this.usersService.getUser(user.userId);
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async getUsers(@Args('searchInput') input: SearchUserInput): Promise<User[]> {
    return await this.usersService.getUsers(input);
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getUsersCount(
    @Args('searchInput') input: SearchUserInput,
  ): Promise<number> {
    return await this.usersService.getUsersCount(input);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return await this.usersService.getUser(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') input: UpdateUserInput,
  ): Promise<boolean> {
    return await this.usersService.updateUser(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
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
