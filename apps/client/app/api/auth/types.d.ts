import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      app: string;
    };
  }

  interface JWT {
    id: string;
    email?: string | null;
    name?: string | null;
  }
}
