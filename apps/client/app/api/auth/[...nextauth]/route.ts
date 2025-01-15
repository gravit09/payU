import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("Missing email or password");
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          console.error("Invalid email or password");
          throw new Error("Invalid email or password");
        }

        console.log("Authentication successful for user:", user.email);

        return { id: user.id, email: user.email, name: "test" };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log(
        "Session callback called. Session:",
        session,
        "Token:",
        token
      );
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        };
      }
      console.log("Updated session:", session);
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
