import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SessionsService } from './sessions.service';
import { Session } from './session.schema';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { SearchSessionInput } from './search-session.input';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Session])
  async getSessions(
    @Args('searchInput') input: SearchSessionInput,
  ): Promise<Session[]> {
    return await this.sessionsService.getSessions(input);
  }

  @Query(() => Number)
  async getSessionsCount(
    @Args('searchInput') input: SearchSessionInput,
  ): Promise<number> {
    return await this.sessionsService.getSessionsCount(input);
  }

  @Query(() => Session, { nullable: true })
  async getSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Session | null> {
    return await this.sessionsService.getSession(id);
  }

  @Mutation(() => Boolean)
  async removeSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.sessionsService.removeSession(id);
  }

  @ResolveField()
  async user(@Parent() session: Session): Promise<User | null> {
    return await this.usersService.getUser(session.user.toHexString());
  }
}
