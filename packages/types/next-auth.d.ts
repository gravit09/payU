import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string | null;
  }

  interface Session {
    user: User & { id: number };
  }

  interface JWT {
    id: number;
  }
}
