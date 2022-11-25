import { InputType, Field } from '@nestjs/graphql';
import { Matches, IsNotEmpty } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Matches(/^09[0-9]{9}$/)
  @Field(() => String)
  mobile: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Field(() => UserRole)
  role: UserRole;

  registerOtp?: string | null;
  resetOtp?: string | null;
  otpExpiredAt?: Date | null;
}
