import { Resolver, Mutation, Args, } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginPasswordInput } from './input-types/login-password.input';
import { LoginResult } from './object-types/login-result';
import { RefreshResult } from './object-types/refresh-result';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Mutation(() => LoginResult)
  async loginPassword(
    @Args('input') input: LoginPasswordInput,
  ): Promise<LoginResult> {
    return this.authService.loginPassword(input)
  }

  @Mutation(() => RefreshResult)
  async refreshToken(
    @Args('token') token: string,
  ): Promise<RefreshResult> {
    return this.authService.refreshToken(token)
  }
}
