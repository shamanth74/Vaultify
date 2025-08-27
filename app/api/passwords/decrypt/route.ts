import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import CryptoJS from "crypto-js";

function decryptPassword(encryptedPassword: string, masterPassword: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function POST(req: Request) {
  try {
    const { masterPassword,passwordId } = await req.json();

    // Fetch the password entry from DB
    const passwordEntry = await prisma.password.findUnique({
      where: { id:passwordId },
      include: { user: true }, // so we can access user.masterPasswordHash
    });

    if (!passwordEntry) {
      return new Response(JSON.stringify({ error: "Password not found" }), { status: 404 });
    }

    // Verify master password (assuming hashed master password is stored in user table)
    //@ts-ignore
    const isValid = await compare(masterPassword, passwordEntry.user.master_password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid master password" }), { status: 401 });
    }

    // Decrypt the password
    const decryptedPassword = decryptPassword(passwordEntry.password, masterPassword);

    return new Response(
      JSON.stringify({ 
        password: decryptedPassword 
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
