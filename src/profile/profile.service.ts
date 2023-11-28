import { Injectable } from '@nestjs/common';
import { UpdateProfileInput } from './input-types/update-profile.input';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../auth/jwt-payload';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  async getProfile(jwt: JwtPayload): Promise<User> {
    return await this.usersService.getUser(jwt.userId)
  }

  async updateProfile(input: UpdateProfileInput, jwt: JwtPayload): Promise<boolean> {
    return await this.usersService.updateUser(jwt.userId, input)
  }
}
