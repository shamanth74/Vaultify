import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
function decryptPassword(encryptedPassword: string, masterPassword: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., lokify@gmail.com
    pass: process.env.EMAIL_PASS, // app password for Gmail
  },
});
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: passwordEntry.user.email,
      subject: "Your Password Was Viewed 🔒",
      text: `Your password for ${passwordEntry.platform} was just accessed.`,
      html: `<p>Your password for <b>${passwordEntry.platform}</b> was just accessed.If not you take the necessary actions!</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Error sending email:", error);
      else console.log("Email sent:", info.response);
    });
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
