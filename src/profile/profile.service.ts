import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UpdateProfileInput } from './input-types/update-profile.input';
import { UpdatePasswordInput } from './input-types/update-password.input';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(jwt: JwtPayload): Promise<User | null> {
    return await this.usersService.getUser(jwt.userId);
  }

  async updateProfile(
    jwt: JwtPayload,
    input: UpdateProfileInput,
  ): Promise<boolean> {
    return await this.usersService.updateUser(jwt.userId, input);
  }

  async updatePassword(
    jwt: JwtPayload,
    input: UpdatePasswordInput,
  ): Promise<boolean> {
    const user = await this.usersService.getUser(jwt.userId);
    if (!user) throw new BadRequestException();

    const same = await bcrypt.compare(input.oldPassword, user.password);
    if (!same) throw new BadRequestException();

    return await this.usersService.updateUser(jwt.userId, {
      password: input.newPassword,
    });
  }
}
