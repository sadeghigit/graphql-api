import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  mobile: string;

  @Field(() => String)
  password: string;
}
