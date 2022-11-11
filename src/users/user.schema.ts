import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { name: 'id' })
  _id: Types.ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Prop({ unique: true })
  @Field(() => String)
  mobile: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
