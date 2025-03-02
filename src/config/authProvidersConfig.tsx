import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authProvidersConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const phone = normalizePhoneNumber(credentials.phone as string);
        if (phone) {
          const [userInfo] = await db
            .select()
            .from(users)
            .where(eq(users.phone, phone));
          const user = {
            ...userInfo,
            phone,
          };
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export default authProvidersConfig;
