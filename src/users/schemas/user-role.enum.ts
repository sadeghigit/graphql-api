import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

registerEnumType(UserRole, { name: "UserRole" })
