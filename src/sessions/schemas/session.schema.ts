import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

const ObjectId = mongoose.Schema.Types.ObjectId

@Schema({ versionKey: false, timestamps: true })
export class Session {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  refreshAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);