import { InputType, Field } from '@nestjs/graphql';
import { Matches, IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshInput {
  @IsNotEmpty()
  @Matches(/^[0-9a-zA-Z]{64}$/)
  @Field(() => String)
  refreshToken: string;
}
