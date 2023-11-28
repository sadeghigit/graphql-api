import { Types } from "mongoose";
import { UserRole } from "../users/schemas/user-role.enum";

export interface JwtPayload {
  userId: Types.ObjectId;
  userRole: UserRole;
}
