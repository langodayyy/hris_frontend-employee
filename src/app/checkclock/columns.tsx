"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { differenceInMinutes } from "date-fns";

import { Button } from "@/components/ui/button";
import { ApprovalStatusBadge } from "@/components/ui/approval";

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
import RejectionReasonDialog from "@/components/ui/reject-reason-dialog";


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
    accessorKey: "workHours",
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
         <RejectionReasonDialog
                  reasonText="See Reason"
                  dialogTitle="Why it was rejected"
                  dialogDescription={reason}
                  buttonLabel="View"
                />
      );
    },
  },
];
