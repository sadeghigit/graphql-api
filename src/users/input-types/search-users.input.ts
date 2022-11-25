import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  NotEquals,
  IsOptional,
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsArray,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

@InputType()
export class SearchUserInput {
  @NotEquals(null)
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsDate({ each: true })
  @IsArray()
  @IsOptional()
  @Field(() => [Date], { nullable: true })
  createdAt?: Date[];

  @NotEquals(null)
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsDate({ each: true })
  @IsArray()
  @IsOptional()
  @Field(() => [Date], { nullable: true })
  updatedAt?: Date[];

  @NotEquals(null)
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @NotEquals(null)
  @IsOptional()
  @Field(() => String, { nullable: true })
  mobile?: string;

  @IsEnum(UserRole, { each: true })
  @IsArray()
  @NotEquals(null)
  @IsOptional()
  @Field(() => [UserRole], { nullable: true })
  role?: UserRole[];
}
