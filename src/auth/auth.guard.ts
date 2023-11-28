import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../users/schemas/user-role.enum';
import { Reflector } from '@nestjs/core';
import { Types } from 'mongoose';

export const Role = (role: UserRole) => SetMetadata('role', role);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequestFromContext(context)

        const token = this.extractTokenFromHeader(request);
        if (!token) return true;

        try {
            const payload = await this.authService.verifyToken(token);
            request['user'] = {
                userId: new Types.ObjectId(payload.userId),
                userRole: payload.userRole
            }
            const role: UserRole = this.reflector.get('role', context.getHandler());
            return !role || request['user'].userRole === role;
        } catch {
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private getRequestFromContext(context: ExecutionContext): Request {
        if (context.getType<GqlContextType>() === 'graphql')
            return GqlExecutionContext.create(context).getContext().req;
        return context.switchToHttp().getRequest()
    }
}