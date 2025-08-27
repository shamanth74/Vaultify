import { useState, useEffect } from "react";
import { AppDialog } from "@/components/ui/AppDialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Clipboard,ClipboardCheck , EyeOff } from "lucide-react";

export function ViewPasswordModal({ open, onOpenChange, passwordEntry }: any) {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [masterPassword, setMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(20);
  const [copied, setCopied] = useState(false); // New: copied state

  const handleDecrypt = async (passwordId: string, masterPassword: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`/api/passwords/decrypt`, {
        masterPassword,
        passwordId,
      });
      setDecrypted(res.data.password);
      setTimer(20); // start timer
      return res.data.password;
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to fetch at this moment. Try again");
    } finally {
      setLoading(false);
    }
  };

  // Timer effect: hide password after 20s
  useEffect(() => {
    if (!decrypted) return;
    if (timer <= 0) {
      setDecrypted(null);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [decrypted, timer]);

  const handleCopy = () => {
    if (decrypted) {
      navigator.clipboard.writeText(decrypted);
      setCopied(true); // show toast
      setTimeout(() => setCopied(false), 3000); // hide after 3s
    }
  };

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange} title="View Password">
        <div className="space-y-4">
          <p>
            <strong>Platform:</strong> {passwordEntry.platform}
          </p>
          {passwordEntry.platform_url && (
            <p>
              <strong>URL:</strong> {passwordEntry.platform_url}
            </p>
          )}
          {passwordEntry.platform_username && (
            <p>
              <strong>Username:</strong> {passwordEntry.platform_username}
            </p>
          )}

          {!decrypted && (
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Enter Master Password to decrypt"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button
                onClick={async () => {
                  try {
                    await handleDecrypt(passwordEntry.id, masterPassword);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                disabled={loading || !masterPassword}
              >
                {loading ? (
                  <>
                    Decrypting... <Spinner />
                  </>
                ) : (
                  "Decrypt Password"
                )}
              </Button>
            </div>
          )}

          {decrypted && (
            <div className="flex flex-col space-y-2">
              <p>
                <strong>Password:</strong> {decrypted}
              </p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                {!copied? (
                    <>
                    <Clipboard size={16} className="mr-1" /> Copy
                    </>
                ):(
                    <>
                    <ClipboardCheck size={16} className="mr-1"/>Copied
                    </>
                )}
                  
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDecrypted(null)}
                >
                  <EyeOff size={16} /> Hide
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Password will be hidden in {timer}s
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </AppDialog>

      {/* Toast for copied password */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-100 opacity-100">
          Password copied to clipboard!
        </div>
      )}
    </>
  );
}
