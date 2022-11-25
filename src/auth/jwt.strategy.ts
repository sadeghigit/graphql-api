import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/users/schemas/user.schema';
import { Types } from 'mongoose';

export type JwtPayload = { userId: Types.ObjectId; userRole: UserRole };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return {
      userId: new Types.ObjectId(payload.userId),
      userRole: payload.userRole,
    };
  }
}
