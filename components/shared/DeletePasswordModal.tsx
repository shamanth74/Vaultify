import { useState } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
import { DeletePasswordModalProps } from "@/types";
import { passwordService } from "@/services/api";

export default function DeletePasswordModal({ open, onOpenChange, passwordEntry, onPasswordDeleted }: DeletePasswordModalProps) {
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (password_id: string, masterPassword: string) => {
    setLoading(true);
    try {
      const result = await passwordService.deletePassword({
        passwordId: password_id,
        masterPassword,
      });
      
      if (result.success) {
        toast.success("Password deleted successfully!");

        // ⏳ Show toast for 3s, then close modal & call fetch
        setTimeout(() => {
          onOpenChange(false); // Close modal
          if (onPasswordDeleted) {
            onPasswordDeleted(); // Call fetch after modal closes
          }
        }, 3000);
      } else {
        setError(result.error || "Unable to delete");
      }
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
    </>
  );
}
