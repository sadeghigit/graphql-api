import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class UploadInput {
  @Field(() => GraphQLUpload)
  file!: FileUpload;
}
