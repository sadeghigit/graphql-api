import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginInput } from './login.input';
import { LoginResult } from './login.result';
import { RefreshInput } from './refresh.input';
import { RefreshResult } from './refresh.result';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  async authLogin(input: LoginInput): Promise<LoginResult> {
    const user = await this.usersService.getUserByMobile(input.mobile);
    if (!user) throw new BadRequestException();

    const same = await bcrypt.compare(input.password, user.password);
    if (!same) throw new BadRequestException();

    const payload: JwtPayload = {
      userRole: user.role,
      userId: user._id.toHexString(),
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN as string) * 1000;
    const session = await this.sessionsService.createSession({
      user: user._id,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      expiresAt: new Date(Date.now() + expiresIn),
      refreshToken: session.refreshToken,
    };
  }

  async authRefresh(input: RefreshInput): Promise<RefreshResult> {
    const session = await this.sessionsService.getSessionByRefershToken(
      input.refreshToken,
    );
    if (!session) throw new BadRequestException();

    const user = await this.usersService.getUserByMobile(
      session.user.toHexString(),
    );
    if (!user) throw new BadRequestException();

    const payload: JwtPayload = {
      userRole: user.role,
      userId: user._id.toHexString(),
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN as string) * 1000;

    return {
      accessToken: this.jwtService.sign(payload),
      expiresAt: new Date(Date.now() + expiresIn),
    };
  }
}
