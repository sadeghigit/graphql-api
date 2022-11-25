import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/auth/current-user';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { UpdatePasswordInput } from './input-types/update-password.input';
import { UpdateProfileInput } from './input-types/update-profile.input';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  async getProfile(@CurrentUser() jwt: JwtPayload): Promise<User | null> {
    return await this.profileService.getProfile(jwt);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async updateProfile(
    @CurrentUser() jwt: JwtPayload,
    @Args('updateProfileInput') input: UpdateProfileInput,
  ): Promise<boolean> {
    return await this.profileService.updateProfile(jwt, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async updatePassword(
    @CurrentUser() jwt: JwtPayload,
    @Args('updatePasswordInput') input: UpdatePasswordInput,
  ): Promise<boolean> {
    return await this.profileService.updatePassword(jwt, input);
  }
}
