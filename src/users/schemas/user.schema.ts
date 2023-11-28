import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRole } from './user-role.enum';

@ObjectType()
@Schema({ versionKey: false, timestamps: true })
export class User {
  @Field(() => ID, { name: "id" })
  _id: Types.ObjectId

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Prop({ type: String, required: true })
  password: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  mobile: string;

  @Field(() => UserRole)
  @Prop({ type: String, required: true, enum: UserRole })
  userRole: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);