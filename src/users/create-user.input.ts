import { InputType, Field } from '@nestjs/graphql';
import { Matches, IsNotEmpty } from 'class-validator';
import { UserRole } from './user.schema';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Matches(/^09[0-9]{9}$/)
  @Field(() => String)
  mobile: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Field(() => UserRole)
  userRole: UserRole;
}
