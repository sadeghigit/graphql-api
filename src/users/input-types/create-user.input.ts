import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../schemas/user-role.enum';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  mobile: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole)
  userRole: UserRole;
}
