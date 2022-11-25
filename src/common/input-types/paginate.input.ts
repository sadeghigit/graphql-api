import { InputType, Field, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

@InputType()
export class PaginateInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Field(() => Int, { defaultValue: 0 })
  perPage: number;

  @IsOptional()
  @Field(() => String, { defaultValue: 'createdAt' })
  sort: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Field(() => String, { defaultValue: 'asc' })
  sortDir: SortOrder;
}
