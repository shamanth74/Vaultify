"use client";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AppAlertProps {
  open: boolean;
  type?: "success" | "error";
  message: string;
  onClose: () => void; // always called to close alert
  onSuccessClose?: () => void; // optional, called only for success
  linkTo?: string;
}

export function AppAlert({ open, type = "error", message, onClose, onSuccessClose, linkTo }: AppAlertProps) {
  const handleClose = () => {
    onClose(); // always close the alert
    if (type === "success" && onSuccessClose) {
      onSuccessClose(); // close modal only on success
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{type === "success" ? "Success ✅" : "Error ❌"}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {type === "success" && linkTo ? (
            <Link href={linkTo} prefetch={false}>
              <AlertDialogAction>Proceed</AlertDialogAction>
            </Link>
          ) : (
            <AlertDialogCancel onClick={handleClose}>
              {type === "success" ? "Close" : "Retry"}
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
