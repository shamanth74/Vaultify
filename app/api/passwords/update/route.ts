import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import CryptoJS from "crypto-js";
function encryptPassword(password: string, masterPassword: string) {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
}
export async function PUT(req:Request){
    try{
        const { masterPassword, passwordId,newPassword } = await req.json();
        const passwordEntry = await prisma.password.findUnique({
          where: { id: passwordId },
          include: { user: true },
        });
        if (!passwordEntry) {
          return new Response(JSON.stringify({ error: "Password not found" }), {
            status: 404,
          });
        }
        //@ts-ignore
        const isValid = await compare(masterPassword, passwordEntry.user.master_password);
        if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid master password" }), { status: 401 });
        }
          const encryptedPassword = encryptPassword(newPassword, masterPassword);
        const updatePasswor=await prisma.password.update({
            where : {id:passwordId},
            data:{
                password:encryptedPassword,
                lastUpdated:new Date()
            },
        });
          return new Response(JSON.stringify({msg:"Password Updated successfully"}), { status: 201 });
    }
    catch(e:any){
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

