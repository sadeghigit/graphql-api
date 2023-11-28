import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Otp {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  mobile: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);