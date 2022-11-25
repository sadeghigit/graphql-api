import { InputType, Field } from '@nestjs/graphql';
import { Matches, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @Matches(/^09[0-9]{9}$/)
  @Field(() => String)
  mobile: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
