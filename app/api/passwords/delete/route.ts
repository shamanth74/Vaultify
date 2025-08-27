import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export async function POST(req:Request) {
    try{
        const {passwordId,masterPassword}=await req.json();
    const passwordEntry = await prisma.password.findUnique({
        where:{id:passwordId},
        include: { user: true }
    })
    if (!passwordEntry) {
      return new Response(JSON.stringify({ error: "Password not found" }), { status: 404 });
    }
    //@ts-ignore
    const isValid = await compare(masterPassword, passwordEntry.user.master_password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid master password" }), { status: 401 });
    }
    await prisma.password.delete({
        where:{id : passwordId}
    });
    return new Response(JSON.stringify({msg:"Password Deleted Successfully"}),{status:200});
    }catch(e){
        return new Response(JSON.stringify({msg:"Internal Server Error"}),{status:500});
    }
    
}