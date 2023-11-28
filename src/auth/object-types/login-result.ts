import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field(() => String)
  accessToken: string;

  @Field(() => Int)
  expiresIn: number;

  @Field(() => String)
  refreshToken: string;
}
