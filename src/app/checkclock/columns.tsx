"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { differenceInMinutes } from "date-fns";

import { Button } from "@/components/ui/button";
import { ApprovalStatusBadge } from "@/components/ui/approval";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { AvatarImage } from "@radix-ui/react-avatar";
import Information from "@/components/ui/attendance-information";
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
} from "@/components/ui/alert-dialog";
import DownloadButton from "@/components/ui/downloadButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CheckclockOverview = {
  id: number;
  date?: string | { startDate: string; endDate: string };
  clockIn?: string;
  clockOut?: string;
  workType?: string;
  status: string;
  approvalStatus?: string;
  reason?: string;
};

const calculateWorkHours = (
  clockIn: string | undefined,
  clockOut: string | undefined
): string => {
  // Helper to check if a value is a valid time string (HH:mm or HH:mm:ss)
  const isTimeOnly = (str: string) =>
    typeof str === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(str);
  // Helper to check if a value is a valid ISO datetime string
  const isDateTime = (str: string) =>
    typeof str === "string" && !isTimeOnly(str) && !isNaN(Date.parse(str));

  // Check for undefined, null, empty string, or non-string types
  if (
    typeof clockIn !== "string" ||
    typeof clockOut !== "string" ||
    clockIn.trim() === "" ||
    clockOut.trim() === "" ||
    (!isTimeOnly(clockIn) && !isDateTime(clockIn)) ||
    (!isTimeOnly(clockOut) && !isDateTime(clockOut))
  ) {
    // Don't log error for objects, just return N/A
    return "-";
  }

  const defaultDate = "1970-01-01";
  const clockInDate = new Date(
    isTimeOnly(clockIn) ? `${defaultDate}T${clockIn}` : clockIn
  );
  const clockOutDate = new Date(
    isTimeOnly(clockOut) ? `${defaultDate}T${clockOut}` : clockOut
  );

  if (isNaN(clockInDate.getTime()) || isNaN(clockOutDate.getTime())) {
    return "N/A";
  }

  const totalMinutes = differenceInMinutes(clockOutDate, clockInDate);
  if (totalMinutes < 0) return "N/A";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const columns: ColumnDef<CheckclockOverview>[] = [
  {
    accessorKey: "no",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 50,
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as
        | string
        | { startDate: string; endDate: string };
      return (
        <div className="text-center">
          {typeof date === "string" ? date : `${date.startDate}`}
        </div>
      );
    },
  },

  {
    accessorKey: "clockIn",
    header: ({ column }) => {
      return <div className="text-center">Clock In</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("clockIn")}</div>
    ),
  },
  {
    accessorKey: "clockOut",
    header: ({ column }) => {
      return <div className="text-center">Clock Out</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("clockOut")}</div>
    ),
  },
  {
    accessorKey: "workType",
    header: ({ column }) => {
      return <div className="text-center">Work Type</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("workType")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div className="text-center">Status</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("status")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId));
      }
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "Work Hours",
    id: "actions",
    header: ({ column }) => {
      return <div className="text-center">Work Hours</div>;
    },
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | undefined;
      const clockOut = row.getValue("clockOut") as string | undefined;
      const status = row.getValue("status") as string | undefined;
      // Show work hours only if clockIn and clockOut exist, regardless of status (including Absent)
      if (clockIn && clockOut) {
        const workHours = calculateWorkHours(clockIn, clockOut);
        return (
          <div className="w-full flex items-center justify-center">
            {workHours}
          </div>
        );
      }
      return <div className="w-full flex items-center justify-center">-</div>;
    },
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => {
      return <div className="text-center">Approval Status</div>;
    },
    cell: ({ row }) => {
      const approvalStatus = row.getValue("approvalStatus") as
        | string
        | undefined;
      if (!approvalStatus) {
        return null;
      }
      return (
        <ApprovalStatusBadge
          status={approvalStatus as "Approved" | "Pending" | "Rejected"}
        />
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId));
      }
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return <div className="text-center">Reason</div>;
    },
    cell: ({ row }) => {
      const approvalStatus = row.getValue("approvalStatus") as
        | string
        | undefined;
      const status = row.getValue("status") as string | undefined;
      const clockIn = row.getValue("clockIn") as string | undefined;
      const reason = row.getValue("reason") as string | undefined;
      const showButton =
        approvalStatus === "Rejected" ||
        (status === "Absent" && clockIn && clockIn !== "--:--");
      if (!showButton) return null;
      return (
        <div className="w-full justify-center flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"} size={"sm"}>
                {reason ? reason : "View"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex gap-3">
                  <div className="h-full justify-center flex items-center">

                  <svg width="20" height="20" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" width="100" height="100" rx="50" fill="currentColor"/>
<path d="M50.5135 72.012C48.9349 72.012 47.7189 71.564 46.8655 70.668C46.0549 69.7293 45.6495 68.428 45.6495 66.764V44.876C45.6495 43.1693 46.0549 41.868 46.8655 40.972C47.7189 40.0333 48.9349 39.564 50.5135 39.564C52.0495 39.564 53.2229 40.0333 54.0335 40.972C54.8869 41.868 55.3135 43.1693 55.3135 44.876V66.764C55.3135 68.428 54.9082 69.7293 54.0975 70.668C53.2869 71.564 52.0922 72.012 50.5135 72.012ZM50.5135 34.316C48.7215 34.316 47.3349 33.9107 46.3535 33.1C45.4149 32.2467 44.9455 31.052 44.9455 29.516C44.9455 27.9373 45.4149 26.7427 46.3535 25.932C47.3349 25.0787 48.7215 24.652 50.5135 24.652C52.3055 24.652 53.6709 25.0787 54.6095 25.932C55.5482 26.7427 56.0175 27.9373 56.0175 29.516C56.0175 31.052 55.5482 32.2467 54.6095 33.1C53.6709 33.9107 52.3055 34.316 50.5135 34.316Z" fill="white"/>
</svg>
                  </div>

                  Reason for HR Rejection
                  </AlertDialogTitle>
                <AlertDialogDescription>
                  During working hours you are not in the office
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="w-auto">Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
