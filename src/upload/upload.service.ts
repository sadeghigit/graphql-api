import { Injectable } from '@nestjs/common';
import { UploadResult } from './object-types/upload-result';
import { UploadInput } from './input-types/upload.input';
import { createWriteStream } from 'fs';
import * as RandExp from 'randexp';
import { join } from 'path';

@Injectable()
export class UploadService {
  async upload(uploadInput: UploadInput): Promise<UploadResult> {
    const { createReadStream, filename } = await uploadInput.file;
    const name =
      new RandExp(/^[0-9a-z]{20}$/).gen() + '.' + filename.split('.').pop();
    const path = join(process.cwd(), `./static/uploads/${name}`);
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(createWriteStream(path))
        .on('finish', () => resolve({ link: 'uploads/' + name }));
    });
  }
}
