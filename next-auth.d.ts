import { UserRole } from "@/lib/db/schema";
import { DefaultSession } from "next-auth";

type ExtendUser = {
  role: UserRole;
  phone: string;
};
export type ExtendedUser = DefaultSession["user"] & ExtendUser;
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends ExtendUser {}
}

// declare module "@auth/core/jwt" {
//   interface JWT {
//     role?: UserRole;
//   }
// }
