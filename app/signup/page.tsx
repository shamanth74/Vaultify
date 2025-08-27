"use client"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { Info, Eye, EyeOff } from "lucide-react";
import { AppAlert } from "@/components/ui/Alerts";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmMasterPassword, setConfirmMasterPassword] = useState("");

  // State for toggling visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showConfirmMasterPassword, setShowConfirmMasterPassword] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [success,setSuccess]=useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password!=confirmPassword || masterPassword!=confirmMasterPassword){
        setAlertMessage("Passwords and Confirm Password fields does not match !");
        return;
    }
    try{
      setIsLoading(true);
      const res = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
      master_password: masterPassword,
    });
    setAlertMessage("SignUp successful .Now Login to your account with your credentials")
    setSuccess(true);

    }catch(e:any){
      setAlertMessage(e.response?.data?.error || "Something went wrong. Please try again.");
    }
    finally{
      setIsLoading(false);
    }
  };

  return (

  <div className="flex items-center justify-center min-h-screen bg-slate-300">
    <AppAlert
  open={!!alertMessage || success}
  type={success ? "success" : "error"}
  message={alertMessage || "Operation successful!"}
  onClose={() => setAlertMessage(null)}
  linkTo={success ? "/login" : undefined}
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
          <CardTitle>Create a new Account</CardTitle>
          <CardDescription>Enter your email and set password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md"
                  id="email"
                  type="email"
                  placeholder="sample@lokify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Name</Label>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md"
                  id="name"
                  type="text"
                  
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              {/* Password */}
              <div className="grid gap-3 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-3 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md pr-10"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Master Password */}
              <div className="grid gap-3 relative">
                <div className="flex items-center gap-2">
                  <Label htmlFor="masterPassword">Master Password</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full cursor-pointer">
                        <Info className="w-3 h-3" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">
                      Your master password encrypts all stored passwords. <br />
                      ⚠️It <strong>cannot be changed</strong>. If forgotten, all saved passwords will be lost.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md pr-10 "
                  id="masterPassword"
                  type={showMasterPassword ? "text" : "password"}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-10 cursor-pointer"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                >
                  {showMasterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Confirm Master Password */}
              <div className="grid gap-3 relative">
                <Label htmlFor="confirmMasterPassword">Confirm Master Password</Label>
                <Input
                  className="bg-slate-50 border border-slate-400 rounded-md pr-10"
                  id="confirmMasterPassword"
                  type={showConfirmMasterPassword ? "text" : "password"}
                  value={confirmMasterPassword}
                  onChange={(e) => setConfirmMasterPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowConfirmMasterPassword(!showConfirmMasterPassword)}
                >
                  {showConfirmMasterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Login link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4" prefetch={false}>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}