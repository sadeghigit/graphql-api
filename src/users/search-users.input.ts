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
import { Role } from './user.schema';

@InputType()
export class SearchUserInput {
  @IsEnum(Role, { each: true })
  @IsArray()
  @NotEquals(null)
  @IsOptional()
  @Field(() => [Role], { nullable: true })
  role?: Role[];

  @NotEquals(null)
  @IsOptional()
  @Field(() => String, { nullable: true })
  mobile?: string;

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
}
