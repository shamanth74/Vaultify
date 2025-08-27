import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import CryptoJS from "crypto-js";
import { compare } from "bcrypt";

// Encrypt password using AES with master password
function encryptPassword(password: string, masterPassword: string) {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
}

export async function POST(req: Request) {
  // Verify user session
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authorized" }), { status: 401 });
    //@ts-ignore
  const user_email = session.user?.email; 
  // Parse request body
  const { platform, platform_url, platform_username, password, master_password } = await req.json();
  if (!platform || !password || !master_password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }
  
  //Verify master password
  //@ts-ignore
  const user = await prisma.user.findUnique({ where: { email:user_email } });
  if (!user || !user.master_password) {
    return new Response(JSON.stringify({ error: "User not found or master password missing" }), { status: 400 });
  }

  const isMasterValid = await compare(master_password, user.master_password);
  if (!isMasterValid) {
    return new Response(JSON.stringify({ error: "Incorrect master password" }), { status: 401 });
  }

  //Encrypt the password using master password
  const encryptedPassword = encryptPassword(password, master_password);

  //Store password in DB
  const newPassword = await prisma.password.create({
    data: {
      platform,
      platform_url: platform_url || "",
      platform_username: platform_username || "",
      password: encryptedPassword,
      userId: user.id,
    },
  });

  return new Response(JSON.stringify({msg:"Password added successfully"}), { status: 201 });
}