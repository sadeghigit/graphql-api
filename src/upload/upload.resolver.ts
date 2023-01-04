import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UploadInput } from './input-types/upload.input';
import { UploadResult } from './object-types/upload-result';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => UploadResult)
  async upload(
    @Args('uploadInput') uploadInput: UploadInput,
  ): Promise<UploadResult> {
    return await this.uploadService.upload(uploadInput);
  }
}
