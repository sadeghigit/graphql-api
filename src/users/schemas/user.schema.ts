import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Session } from 'src/sessions/schemas/session.schema';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
registerEnumType(UserRole, { name: 'UserRole' });

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

  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String)
  mobile: string;

  @Prop({ type: String, default: null })
  registerOtp: string | null;

  @Prop({ type: String, default: null })
  resetOtp: string | null;

  @Prop({ type: String, default: null })
  otpExpiredAt: Date | null;

  @Prop()
  password: string;

  @Field(() => UserRole)
  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Field(() => [Session])
  sessions: Session[];
}

export const UserSchema = SchemaFactory.createForClass(User);
