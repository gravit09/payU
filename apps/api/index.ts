import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(): Promise<void> {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword123",
      },
    });

    console.log("User created:", newUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
