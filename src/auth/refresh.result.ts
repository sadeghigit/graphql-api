import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshResult {
  @Field(() => String)
  accessToken: string;

  @Field(() => Date)
  expiresAt: Date;
}
