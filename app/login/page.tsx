"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppAlert } from "@/components/ui/Alerts"

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage,setAlertMessage]=useState("");
    const [isLoading,setisLoading]=useState(false);

    const router = useRouter();

    const handleLogin=async (e: React.FormEvent)=>{
        e.preventDefault();
        setisLoading(true);
        try{
          const res=await signIn("credentials",{
            redirect:false,
            email,
            password
          })
          if (res?.ok) {
            router.push("/dashboard"); // redirect manually
          } 
          else {
            setisLoading(false);
            setAlertMessage("Invalid credentials");
  }
        }catch(e){
          setisLoading(false);
          setAlertMessage("Server unavailable. Please try again later.");
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-pink-700">
          <AppAlert
            open={!!alertMessage}
            type={"error"}
            message={alertMessage || "Internal Server Error!"}
            onClose={() => setAlertMessage("")}
            linkTo={undefined}
          />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-lg">
            <Spinner />
          </div>
        </div>
      )}
  <Card className="text-black bg-white rounded-lg shadow-lg w-full max-w-md p-6">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-slate-50 border border-slate-400 rounded-md"
              id="email"
              type="email"
              placeholder="sample@vaultify.com"
              onChange={(e)=>{setEmail(e.target.value)}}
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              
            </div>
            <Input
              className="bg-slate-50 border border-slate-400 rounded-md"
              id="password"
              type="password"
              onChange={(e)=>{setPassword(e.target.value)}}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Login
            </Button>
            
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Dont have an account?
          <Link href="/signup" className="underline underline-offset-4 ml-2" prefetch={false}>
          SignUp
          </Link>
        </div>
      </form>
    </CardContent>
  </Card>
</div>
    )
}