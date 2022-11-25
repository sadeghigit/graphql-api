import { InputType, Field, ID } from '@nestjs/graphql';
import {
  NotEquals,
  IsOptional,
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsArray,
  Matches,
} from 'class-validator';

@InputType()
export class SearchSessionInput {
  @NotEquals(null)
  @Matches(/^[0-9a-f]{24}$/, { each: true })
  @IsArray()
  @IsOptional()
  @Field(() => [ID], { nullable: true })
  user?: string[];

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
