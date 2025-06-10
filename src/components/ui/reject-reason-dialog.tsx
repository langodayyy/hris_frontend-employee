// components/RejectionReasonDialog.tsx

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type RejectionReasonDialogProps = {
  reasonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  buttonLabel?: string;
};

export default function RejectionReasonDialog({
  reasonText = "View",
  dialogTitle = "Reason for HR Rejection",
  dialogDescription,
  buttonLabel,
}: RejectionReasonDialogProps) {
  return (
    <div className="w-full justify-center flex">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            {buttonLabel || reasonText}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex gap-3">
              <div className="h-full justify-center flex items-center">
               <svg
                      width="20"
                      height="20"
                      viewBox="0 0 101 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="100"
                        height="100"
                        rx="50"
                        fill="currentColor"
                      />
                      <path
                        d="M50.5135 72.012C48.9349 72.012 47.7189 71.564 46.8655 70.668C46.0549 69.7293 45.6495 68.428 45.6495 66.764V44.876C45.6495 43.1693 46.0549 41.868 46.8655 40.972C47.7189 40.0333 48.9349 39.564 50.5135 39.564C52.0495 39.564 53.2229 40.0333 54.0335 40.972C54.8869 41.868 55.3135 43.1693 55.3135 44.876V66.764C55.3135 68.428 54.9082 69.7293 54.0975 70.668C53.2869 71.564 52.0922 72.012 50.5135 72.012ZM50.5135 34.316C48.7215 34.316 47.3349 33.9107 46.3535 33.1C45.4149 32.2467 44.9455 31.052 44.9455 29.516C44.9455 27.9373 45.4149 26.7427 46.3535 25.932C47.3349 25.0787 48.7215 24.652 50.5135 24.652C52.3055 24.652 53.6709 25.0787 54.6095 25.932C55.5482 26.7427 56.0175 27.9373 56.0175 29.516C56.0175 31.052 55.5482 32.2467 54.6095 33.1C53.6709 33.9107 52.3055 34.316 50.5135 34.316Z"
                        fill="white"
                      />
                    </svg>
              </div>
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-auto">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
