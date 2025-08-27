"use client";

import { useState } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import axios from "axios";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { AppAlert } from "@/components/ui/Alerts";

export function UpdatePasswordModal({
  open,
  onOpenChange,
  passwordEntry,
  onPasswordUpdated,
}: any) {
  const [newPassword, setNewPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/passwords/update", {
          masterPassword,
        passwordId: passwordEntry.id,
        newPassword,
      });
      setAlertMessage("Password updated successfully!");
      setSuccess(true);
      if (onPasswordUpdated) onPasswordUpdated();
    } catch (err: any) {
      setAlertMessage(err.response?.data?.error || "Update failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange} title="Update Password">
      <form className="space-y-4" onSubmit={handleUpdate}>
        <input
          name="newPassword"
          type="password"
          placeholder="New Password*"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="masterPassword"
          type="password"
          placeholder="Master Password*"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>

      <AppAlert
        open={!!alertMessage || success}
        type={success ? "success" : "error"}
        message={alertMessage || "Operation successful!"}
        onClose={() => setAlertMessage("")}
        onSuccessClose={() => onOpenChange(false)}
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
