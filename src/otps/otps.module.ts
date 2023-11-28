import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema }
    ])
  ],
  providers: [OtpsService],
  exports: [OtpsService]
})
export class OtpsModule { }
