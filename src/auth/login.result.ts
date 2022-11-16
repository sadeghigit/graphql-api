import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field(() => String)
  accessToken: string;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => String)
  refreshToken: string;
}
