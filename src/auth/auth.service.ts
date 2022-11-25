import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginResult } from './object-types/login-result';
import { RefreshInput } from './input-types/refresh.input';
import { SessionsService } from 'src/sessions/sessions.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';
import { User, UserRole } from 'src/users/schemas/user.schema';
import { CreateSessionInput } from 'src/sessions/input-types/create-session.input';
import { UsersService } from 'src/users/users.service';
import { RefreshResult } from './object-types/refresh-result';
import { LoginInput } from './input-types/login.input';
import { ExpiryResult } from './object-types/expiry-result';
import { Register1Input } from './input-types/register1.input';
import { Register2Input } from './input-types/register2.input';
import { Reset1Input } from './input-types/reset1.input';
import { Reset2Input } from './input-types/reset2.input';
import * as RandExp from 'randexp';
import { CreateUserInput } from 'src/users/input-types/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  async authLogin(loginInput: LoginInput): Promise<LoginResult> {
    const user = await this.usersService.getUserByMobile(loginInput.mobile);
    if (!user) throw new BadRequestException();
    if (user.registerOtp != null) throw new BadRequestException();

    const same = await bcrypt.compare(loginInput.password, user.password);
    if (!same) throw new BadRequestException();

    return {
      accessToken: this.generateAccessToken(user),
      expiresAt: this.generateExpiresAt(),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async authRefresh(refreshInput: RefreshInput): Promise<RefreshResult> {
    const session = await this.sessionsService.getSessionByRefershToken(
      refreshInput.refreshToken,
    );
    if (!session) throw new BadRequestException();

    const user = await this.usersService.getUserByMobile(
      session.user.toHexString(),
    );
    if (!user) throw new BadRequestException();

    return {
      accessToken: this.generateAccessToken(user),
      expiresAt: this.generateExpiresAt(),
    };
  }

  async authRegister1(register1Input: Register1Input): Promise<ExpiryResult> {
    const otpExpiredAt = this.generateOtpExpiredAt();
    const registerOtp = new RandExp(/^[0-9]{5}$/).gen();

    const user = await this.usersService.getUserByMobile(register1Input.mobile);

    const data: CreateUserInput = {
      ...register1Input,
      otpExpiredAt,
      registerOtp,
      role: UserRole.USER,
    };

    if (user && user.registerOtp) {
      // registered user, but not verified
      await this.usersService.updateUser(user._id, data);
    } else {
      // register new user
      await this.usersService.createUser(data);
    }

    // todo: send register otp sms
    console.log('registerOtp', registerOtp);
    return { expiresAt: otpExpiredAt };
  }

  async authRegister2(register2Input: Register2Input): Promise<LoginResult> {
    const user = await this.usersService.getUserByMobile(register2Input.mobile);
    if (!user) throw new BadRequestException();

    const same = user.registerOtp === register2Input.registerOtp;
    if (!same) throw new BadRequestException();

    await this.usersService.updateUser(user._id, {
      otpExpiredAt: null,
      registerOtp: null,
    });

    return {
      accessToken: this.generateAccessToken(user),
      expiresAt: this.generateExpiresAt(),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async authReset1(reset1Input: Reset1Input): Promise<ExpiryResult> {
    const otpExpiredAt = this.generateOtpExpiredAt();
    const resetOtp = new RandExp(/^[0-9]{5}$/).gen();

    const user = await this.usersService.getUserByMobile(reset1Input.mobile);
    if (!user) throw new BadRequestException();
    if (user.registerOtp != null) throw new BadRequestException();

    await this.usersService.updateUser(user._id, { otpExpiredAt, resetOtp });

    // todo: send reset otp sms
    console.log('resetOtp', resetOtp);
    return { expiresAt: otpExpiredAt };
  }

  async authReset2(reset2Input: Reset2Input): Promise<LoginResult> {
    const user = await this.usersService.getUserByMobile(reset2Input.mobile);
    if (!user) throw new BadRequestException();

    const same = user.resetOtp === reset2Input.resetOtp;
    if (!same) throw new BadRequestException();

    await this.usersService.updateUser(user._id, {
      otpExpiredAt: null,
      resetOtp: null,
      password: reset2Input.password,
    });

    return {
      accessToken: this.generateAccessToken(user),
      expiresAt: this.generateExpiresAt(),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  generateAccessToken(user: User): string {
    const payload: JwtPayload = { userRole: user.role, userId: user._id };
    return this.jwtService.sign(payload);
  }

  generateExpiresAt(): Date {
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN as string) * 1000;
    return new Date(Date.now() + expiresIn);
  }

  generateOtpExpiredAt(): Date {
    return new Date(Date.now() + 60 * 2 * 1000);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const input: CreateSessionInput = { user: user._id };
    const session = await this.sessionsService.createSession(input);
    return session.refreshToken;
  }
}
