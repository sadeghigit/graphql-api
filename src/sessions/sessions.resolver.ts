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
import { Session } from './schemas/session.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { SearchSessionInput } from './input-types/search-session.input';
import { ParseIdPipe } from 'src/common/parse-id.pipe';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Session])
  @UseGuards(GqlAuthGuard)
  async getSessions(
    @Args('searchInput') searchInput: SearchSessionInput,
  ): Promise<Session[]> {
    return await this.sessionsService.getSessions(searchInput);
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getSessionsCount(
    @Args('searchInput') searchInput: SearchSessionInput,
  ): Promise<number> {
    return await this.sessionsService.getSessionsCount(searchInput);
  }

  @Query(() => Session, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getSession(
    @Args('id', { type: () => ID }, ParseIdPipe) id: Types.ObjectId,
  ): Promise<Session | null> {
    return await this.sessionsService.getSession(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeSession(
    @Args('id', { type: () => ID }, ParseIdPipe) id: Types.ObjectId,
  ): Promise<boolean> {
    return await this.sessionsService.removeSession(id);
  }

  @ResolveField()
  @UseGuards(GqlAuthGuard)
  async user(@Parent() session: Session): Promise<User | null> {
    return await this.usersService.getUser(session.user);
  }
}
