import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResult } from './login.result';
import { LoginInput } from './login.input';
import { RefreshResult } from './refresh.result';
import { RefreshInput } from './refresh.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult)
  async authLogin(@Args('loginInput') input: LoginInput): Promise<LoginResult> {
    return await this.authService.authLogin(input);
  }

  @Mutation(() => RefreshResult)
  async authRefresh(
    @Args('refreshInput') input: RefreshInput,
  ): Promise<RefreshResult> {
    return await this.authService.authRefresh(input);
  }
}
