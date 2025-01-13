import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      app: String;
    };
  }

  interface JWT {
    id: string;
    email?: string | null;
    name?: string | null;
    app: String;
  }
}
