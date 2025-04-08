import NextAuth from "next-auth";
import authProvidersConfig from "@/config/authProvidersConfig";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({}) {},
  },
  callbacks: {
    async signIn({ user }) {
      Object.assign(user, {
        ...user,
        id: user.id,
        role: user.role,
        phone: user.phone,
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.sub || session.user.id,
          email: token.email ?? session.user.email,
          name: token.name ?? session.user.name,
          phone: (token.phone || session.user.phone) as string,
          role: (token.role ?? session.user.role) as never,
        };
      }
      return session;
    },
    async jwt({ token, trigger, session, user }) {
      token.phone = token?.phone || user?.phone;
      token.role = token?.role || user?.role;

      if (trigger === "update") {
        const updatedSession = session;
        try {
          Object.keys(updatedSession).forEach((key) => {
            token[key] = updatedSession[key];
          });
        } catch (error) {
          console.error(error);
        }
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  trustHost: true,

  ...authProvidersConfig,
});
