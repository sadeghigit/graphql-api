import { InputType, Field } from '@nestjs/graphql';
import { Matches, IsNotEmpty } from 'class-validator';

@InputType()
export class Reset2Input {
  @IsNotEmpty()
  @Matches(/^09[0-9]{9}$/)
  @Field(() => String)
  mobile: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{5}$/)
  @Field(() => String)
  resetOtp: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
