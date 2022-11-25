import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResult } from './object-types/login-result';
import { RefreshInput } from './input-types/refresh.input';
import { LoginInput } from './input-types/login.input';
import { RefreshResult } from './object-types/refresh-result';
import { Register1Input } from './input-types/register1.input';
import { Register2Input } from './input-types/register2.input';
import { Reset1Input } from './input-types/reset1.input';
import { Reset2Input } from './input-types/reset2.input';
import { ExpiryResult } from './object-types/expiry-result';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult)
  async authLogin(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResult> {
    return await this.authService.authLogin(loginInput);
  }

  @Mutation(() => RefreshResult)
  async authRefresh(
    @Args('refreshInput') refreshInput: RefreshInput,
  ): Promise<RefreshResult> {
    return await this.authService.authRefresh(refreshInput);
  }

  @Mutation(() => ExpiryResult)
  async authRegister1(
    @Args('register1Input') register1Input: Register1Input,
  ): Promise<ExpiryResult> {
    return await this.authService.authRegister1(register1Input);
  }

  @Mutation(() => LoginResult)
  async authRegister2(
    @Args('register2Input') register2Input: Register2Input,
  ): Promise<LoginResult> {
    return await this.authService.authRegister2(register2Input);
  }

  @Mutation(() => ExpiryResult)
  async authReset1(
    @Args('reset1Input') reset1Input: Reset1Input,
  ): Promise<ExpiryResult> {
    return await this.authService.authReset1(reset1Input);
  }

  @Mutation(() => LoginResult)
  async authReset2(
    @Args('reset2Input') reset2Input: Reset2Input,
  ): Promise<LoginResult> {
    return await this.authService.authReset2(reset2Input);
  }
}
