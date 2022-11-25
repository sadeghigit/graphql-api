import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @IsNotEmpty()
  @Field(() => String)
  oldPassword: string;

  @IsNotEmpty()
  @Field(() => String)
  newPassword: string;
}
