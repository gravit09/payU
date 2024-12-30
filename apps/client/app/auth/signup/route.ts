import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response("Email and password are required", {
      status: 400,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response("User already exists", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (err) {
    return new Response("Error creating user", { status: 500 });
  }
}