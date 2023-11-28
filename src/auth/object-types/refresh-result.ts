import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RefreshResult {
  @Field(() => String)
  accessToken: string;

  @Field(() => Int)
  expiresIn: number;
}
