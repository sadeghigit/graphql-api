import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { UpdateProfileInput } from './input-types/update-profile.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user';
import { JwtPayload } from '../auth/jwt-payload';
import { User } from '../users/schemas/user.schema';

@Resolver()
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
  ) { }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async getProfile(
    @CurrentUser() jwt: JwtPayload
  ): Promise<User> {
    return this.profileService.getProfile(jwt)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentUser() jwt: JwtPayload
  ): Promise<boolean> {
    return this.profileService.updateProfile(input, jwt)
  }

}
