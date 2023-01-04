import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResult {
  @Field(() => String)
  link!: string;
}
