import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [UploadResolver, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
