import db from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  if (!email || !password || !username) {
    return new Response("Email,username and password are required", {
      status: 400,
    });
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return new Response("User with this credential already exists", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log("rached here");
    const user = await db.user.create({
      data: { email, username, password: hashedPassword },
    });
    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 508,
      headers: { "Content-Type": "application/json" },
    });
  }
}
