import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { SessionsModule } from '../sessions/sessions.module';
import { OtpsModule } from '../otps/otps.module';

@Module({
    imports: [
        OtpsModule, SessionsModule, UsersModule, JwtModule,
    ],
    providers: [AuthService, AuthResolver],
})
export class AuthModule { }
