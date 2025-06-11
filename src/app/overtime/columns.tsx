"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApprovalStatusBadge } from "@/components/ui/approval";

import RejectionReasonDialog from "@/components/ui/reject-reason-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OvertimeOverview = {
  id: number;
  overtimeName?: string;
  date?: string | { startDate: string; endDate: string };
  totalHours?: string;
  overtimePayroll?: string;
  status: string;
};

export const columns: ColumnDef<OvertimeOverview>[] = [
  {
    accessorKey: "no",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 50,
  },
  {
    accessorKey: "overtimeName",
    header: ({ column }) => {
      return <div className="text-center">Overtime Name</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("overtimeName")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
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
    accessorKey: "totalHours",
    header: ({ column }) => {
      return <div className="text-center">Total Hours</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalHours")} Hours</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "overtimePayroll",
    header: ({ column }) => {
      return <div className="text-center">Overtime Payroll</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">IDR {row.getValue("overtimePayroll")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId));
      }
      return row.getValue(columnId) === filterValue;
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
    accessorKey: "reason",
    header: ({ column }) => {
      return <div className="text-center">Reason</div>;
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined;

      const reason = row.getValue("reason") as string | undefined;
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
            dialogDescription="Your overtime payment submission has been reviewed and unfortunately cannot be approved at this time. The submitted request does not meet the required criteria, as the overtime hours were not pre-approved by the supervisor. Please ensure all future overtime work is authorized in advance."
            buttonLabel="View"
          />
        );
      }
    },
  },
];
