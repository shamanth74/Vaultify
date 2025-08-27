import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { passwordId } = await req.json();
  await prisma.password.update({
    where: { id: passwordId },
    data: { ignoreReminder: true },
  });
  return new Response(JSON.stringify({ success: true }));
}