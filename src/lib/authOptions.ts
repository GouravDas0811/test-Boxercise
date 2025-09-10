import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Add other providers if needed

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Only on initial sign-in
      if (user) {
        type UserWithRole = typeof user & { role?: string };
        token.role = (user as UserWithRole).role || "user"; // default to "user"
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
