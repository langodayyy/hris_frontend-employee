"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApprovalStatusBadge } from "@/components/ui/approval";

import RejectionReasonDialog from "@/components/ui/reject-reason-dialog";
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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OvertimeOverview = {
  id: string;
  employee_id: string;
  name: string;
  overtime_name: string;
  // type: "Government Regulation" | "Flat";
  type: string;
  date: string;
  start_hour: number;
  end_hour: number;
  payroll: number;
  // status: "Approved" | "Pending" | "Rejected";
  status: string;
  overtimeEvidenceUrl?: string;
};

export const columns: ColumnDef<OvertimeOverview>[] = [
  {
    accessorKey: "no",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 50,
  },
  {
    accessorKey: "overtime_name",
    header: "Overtime Name",
  },  
  {
    accessorKey: "type",
    header: "Overtime Type",
    filterFn: (row, columnId, filterValues: string[]) => {
      if (filterValues.length === 0) return true; // If no filters selected, show all
      const overtimeType = row.getValue(columnId) as string;
      return filterValues.includes(overtimeType);
    },

  },
    {
    accessorKey: "date",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },

  {
    accessorKey: "start_hour",
    header: "Start Hour",
  },
  {
    accessorKey: "end_hour",
    header: "End Hour",
  },
  {
    accessorKey: "payroll",
    header: "Overtime Payroll",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      const formatted = (value || 0).toLocaleString("id-ID"); // 1.000.000
      return `IDR ${formatted}`;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div className="text-center">Status</div>;
    },
    cell: ({ row }) => {
      const approvalStatus = row.getValue("status") as string | undefined;
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
    accessorKey: "rejection_reason",
    header: ({ column }) => {
      return <div className="text-center">Reason</div>;
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined;

      const reason = row.getValue("rejection_reason") as string | undefined;
      const showButton = status === "Rejected";

      if (!showButton) {
        return (
          <span className="justify-center flex">-</span>
        );
      } else {
        return (
          <RejectionReasonDialog
            reasonText="See Reason"
            dialogTitle="Why it was rejected"
            dialogDescription={reason}
            buttonLabel="View"
          />
        );
      }
    },
  },
  {
    accessorKey: "evidence",
    id: "evidence",
    header: "Evidence",
    cell: ({ row }) => {
      const evidenceUrl = row.original.overtimeEvidenceUrl;
      if (!evidenceUrl) {
        return <span>-</span>;
      }
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              View
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Proof of Attendance</AlertDialogTitle>
              <AlertDialogDescription className="max-h-96 overflow-auto">
                {evidenceUrl ? (
                  <img
                    src={evidenceUrl}
                    alt="Proof of attendance"
                    className="rounded-lg max-w-full"
                  />
                ) : (
                  <p>No evidence uploaded.</p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  }

];
