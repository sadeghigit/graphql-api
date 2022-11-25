import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ExpiryResult {
  @Field(() => Date)
  expiresAt: Date;
}
