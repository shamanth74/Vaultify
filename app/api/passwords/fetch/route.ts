import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authorized" }), { status: 401 });

  const email = session.user?.email;
  if (!email) return new Response(JSON.stringify({ error: "Not authorized" }), { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  try {
    const passwords = await prisma.password.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        platform: true,
        platform_url: true,
        platform_username: true,
        createdAt: true,
      }
    });

    return new Response(JSON.stringify(passwords), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
