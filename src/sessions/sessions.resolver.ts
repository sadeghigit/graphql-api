import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from './session.schema';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { SearchSessionInput } from './search-session.input';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Session])
  @UseGuards(GqlAuthGuard)
  async getSessions(
    @Args('searchInput') input: SearchSessionInput,
  ): Promise<Session[]> {
    return await this.sessionsService.getSessions(input);
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getSessionsCount(
    @Args('searchInput') input: SearchSessionInput,
  ): Promise<number> {
    return await this.sessionsService.getSessionsCount(input);
  }

  @Query(() => Session, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Session | null> {
    return await this.sessionsService.getSession(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.sessionsService.removeSession(id);
  }

  @ResolveField()
  @UseGuards(GqlAuthGuard)
  async user(@Parent() session: Session): Promise<User | null> {
    return await this.usersService.getUser(session.user.toHexString());
  }
}
