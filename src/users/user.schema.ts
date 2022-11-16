import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Session } from 'src/sessions/session.schema';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
registerEnumType(Role, { name: 'Role' });

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
  mobile: string;

  @Prop()
  password: string;

  @Field(() => Role)
  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Field(() => [Session])
  sessions: Session[];
}

export const UserSchema = SchemaFactory.createForClass(User);
