import { useState, useEffect } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
export default function DeletePasswordModal({ open, onOpenChange, passwordEntry, onPasswordDeleted }: any) {
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const handleDelete = async (password_id: any, masterPassword: any) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/passwords/delete", {
        passwordId: password_id,
        masterPassword,
      });
 toast.success("Password deleted successfully!");

      // ⏳ Show toast for 3s, then close modal & call fetch
      setTimeout(() => {
        onOpenChange(false); // Close modal
        if (onPasswordDeleted) {
          onPasswordDeleted(); // Call fetch after modal closes
        }
      }, 3000);
    } catch (e: any) {
      setError(e.response?.data?.error || "Unable to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange} title="Delete password">
        <div className="space-y-4">
          <p>
            <strong>Platform : {passwordEntry.platform}</strong>
          </p>
          ⚠️This action cannot be undone
        </div>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Enter Master Password to Delete"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            className="border p-2 w-full rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            className="bg-red-600"
            onClick={async () => {
              try {
                await handleDelete(passwordEntry.id, masterPassword);
              } catch (err) {
                console.error(err);
              }
            }}
            disabled={loading || !masterPassword}
          >
            {loading ? (
              <>
                Deleting... <Spinner />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </AppDialog>

      {/* Toast message */}
      {/* {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )} */}
    </>
  );
}
