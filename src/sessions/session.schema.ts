import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

const ObjectId = mongoose.Schema.Types.ObjectId;

export type SessionDocument = HydratedDocument<Session>;

@ObjectType()
@Schema({ timestamps: true })
export class Session {
  @Field(() => ID, { name: 'id' })
  _id: Types.ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Field(() => User)
  @Prop({ type: ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
