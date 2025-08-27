"use client";

import { useState,useEffect } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import axios from "axios";
import { AppAlert } from "@/components/ui/Alerts";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Eye, EyeOff } from "lucide-react"; // 👈 added

export function AddPasswordModal({ open, onOpenChange,onPasswordAdded ,initialPassword = "" }: any) {
  const[platformName,setPlatformName]=useState("");
  const[url,setUrl]=useState<string | null>(null);
  const[username,setUsername]=useState<string | null>(null);
  const[password,setPassword]=useState(initialPassword);
  const[masterPassword,setMasterPassword]=useState('');
  const[showMasterPassword,setShowMasterPassword]=useState(false); // 👈 toggle state
  const[alertMessage,setAlertMessage]=useState("");
  const[success,setSuccess]=useState(false);
  const[loading,setIsLoading]=useState(false);

  useEffect(() => {
    if (open) setPassword(initialPassword || "");
  }, [initialPassword, open]);

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    console.log(password,masterPassword,url,platformName,username)
    setIsLoading(true);
    try{
        const res=await axios.post("/api/passwords/add",{
            platform:platformName,
            platform_url:url || "",
            platform_username:username || "",
            password,
            master_password:masterPassword
        });
        setAlertMessage("Password Added Successfully");
        setSuccess(true);
        if (onPasswordAdded) {
        onPasswordAdded?.();
      }
    }catch(e:any){
        setAlertMessage(e.response?.data?.error);
        setSuccess(false);
    }
    finally{
        setIsLoading(false);
    }
  }

  return (
    <AppDialog open={open} onOpenChange={onOpenChange} title="Add New Password">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="platform" placeholder="Platform*" onChange={(e)=>setPlatformName(e.target.value)} className="border p-2 w-full rounded" required />

        <input name="url" placeholder="Platform URL" onChange={(e)=>setUrl(e.target.value)} className="border p-2 w-full rounded" />

        <input name="username" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} className="border p-2 w-full rounded" />

        <input
          name="password"
          value={password}
          placeholder="Password*"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        {/* Master Password with eye toggle */}
        <div className="relative">
          <input
            name="masterPassword"
            type={showMasterPassword ? "text" : "password"}
            placeholder="Master Password*"
            onChange={(e)=>setMasterPassword(e.target.value)}
            className="border p-2 w-full rounded pr-10"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowMasterPassword(!showMasterPassword)}
          >
            {showMasterPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>

      <AppAlert
        open={!!alertMessage || success}
        type={success ? "success" : "error"}
        message={alertMessage || "Operation successful!"}
        onClose={() => setAlertMessage("")} // always close alert
        onSuccessClose={() => onOpenChange(false)} // only close AppDialog on success
        linkTo={undefined}
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-lg">
            <Spinner />
          </div>
        </div>
      )}
    </AppDialog>
  );
}
