"use client";

import { useState } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AppAlert } from "@/components/ui/Alerts";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { AddPasswordModalProps } from "@/types";
import { passwordService } from "@/services/api";

export function AddPasswordModal({ open, onOpenChange, onPasswordAdded }: AddPasswordModalProps) {
  const [platformName, setPlatformName] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(password, masterPassword, url, platformName, username);
    setIsLoading(true);
    
    try {
      const result = await passwordService.addPassword({
        platform: platformName,
        platform_url: url || "",
        platform_username: username || "",
        password,
        master_password: masterPassword
      });
      
      if (result.success) {
        setAlertMessage("Password Added Successfully");
        setSuccess(true);
        if (onPasswordAdded) {
          onPasswordAdded();
        }
      } else {
        setAlertMessage(result.error || "Failed to add password");
        setSuccess(false);
      }
    } catch (e: any) {
      setAlertMessage(e.response?.data?.error || "Failed to add password");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange} title="Add New Password">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input 
          name="platform" 
          placeholder="Platform" 
          onChange={(e) => setPlatformName(e.target.value)} 
          className="border p-2 w-full rounded" 
          required 
        />

        <input 
          name="url" 
          placeholder="Platform URL" 
          onChange={(e) => setUrl(e.target.value)} 
          className="border p-2 w-full rounded" 
        />

        <input 
          name="username" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
          className="border p-2 w-full rounded" 
        />

        <input 
          name="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          className="border p-2 w-full rounded" 
          required
        />

        <input 
          name="masterPassword" 
          type="password" 
          placeholder="Master Password" 
          onChange={(e) => setMasterPassword(e.target.value)} 
          className="border p-2 w-full rounded" 
          required 
        />

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
        onClose={() => setAlertMessage("")}
        onSuccessClose={() => onOpenChange(false)}
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
