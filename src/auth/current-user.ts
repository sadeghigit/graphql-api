import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from './jwt-payload';

export const CurrentUser = createParamDecorator<any, any, JwtPayload>(
  (data: unknown, context: ExecutionContext) => {
    let request = context.switchToHttp().getRequest()

    if (context.getType<GqlContextType>() === 'graphql')
      request = GqlExecutionContext.create(context).getContext().req;

    return request.user;
  }
);
