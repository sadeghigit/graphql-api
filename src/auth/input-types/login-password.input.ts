import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginPasswordInput {
  @Field(() => String)
  mobile: string;

  @Field(() => String)
  password: string;
}
