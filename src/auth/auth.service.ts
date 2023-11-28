import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginPasswordInput } from './input-types/login-password.input';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { LoginResult } from './object-types/login-result';
import { UsersService } from '../users/users.service';
import { RefreshResult } from './object-types/refresh-result';
import { User } from '../users/schemas/user.schema';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService
  ) { }

  getAccessToken(user: User, expiresIn: number): string {
    const option = { secret: process.env.JWT_SECRET, expiresIn }
    return this.jwtService.sign({ userId: user._id }, option)
  }

  async loginPassword(input: LoginPasswordInput): Promise<LoginResult> {
    const user = await this.usersService.findByMobile(input.mobile)
    if (!user) throw new BadRequestException('mobile is invalid')
    const match = await bcrypt.compare(input.password, user.password)
    if (!match) throw new BadRequestException('password is invalid')
    const accessToken = this.getAccessToken(user, 3600)
    const session = await this.sessionsService.generateSession(user._id)
    return { accessToken, refreshToken: session.token, expiresIn: 3600 }
  }

  async refreshToken(token: string): Promise<RefreshResult> {
    const session = await this.sessionsService.verifySession(token)
    const user = await this.usersService.getUser(session.userId)
    const accessToken = this.getAccessToken(user, 3600)
    return { accessToken, expiresIn: 3600 }
  }

}
