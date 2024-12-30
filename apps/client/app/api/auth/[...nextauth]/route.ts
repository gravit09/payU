import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);

        if (!credentials?.email || !credentials.password) {
          console.error("Missing email or password");
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("User fetched from database:", user);

        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          console.error("Invalid email or password");
          throw new Error("Invalid email or password");
        }

        console.log("Authentication successful for user:", user.email);
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback called. Token:", token, "User:", user);

      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      console.log("Updated JWT token:", token);
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
          name: token.name as string | null,
        };
      }

      console.log("Updated session:", session);
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
