"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";


import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  date, 
  onDateChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filters, setFilters] = useState({
    status: [] as string[],
    approvalStatus: [] as string[],
  });
  const applyClickedRef = useRef(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // const [date, setDate] = React.useState<Date>();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1, // React Table menggunakan 0-based index
        pageSize: rowsPerPage,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setCurrentPage(newPagination.pageIndex + 1); // Perbarui halaman (1-based index)
      setRowsPerPage(newPagination.pageSize); // Perbarui jumlah baris per halaman
    },
  });

  const handleRowsChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // reset ke halaman 1
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  

  return (
    <>
      <div className="flex items-center gap-6 w-full justify-between">
        <span className="w-[187px] text-lg flex-none">Checkclock Overview</span>
        <div className="flex items-center py-4 gap-6">
          <div className="w-fit">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"calendar"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-neutral-300"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Today</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-fit">
            <DropdownMenu
              onOpenChange={(open) => {
                if (!open && !applyClickedRef.current) {
                  setFilters(tempFilters);
                  table.setColumnFilters(
                    Object.entries(tempFilters)
                      .filter(([_, value]) => value.length > 0)
                      .map(([key, value]) => ({
                        id: key,
                        value,
                      }))
                  );
                }
                if (!open) {
                  applyClickedRef.current = false; // reset
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  icon={
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10.5H15M2.5 5.5H17.5M7.5 15.5H12.5"
                        stroke="currentColor"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                {["On Time", "Late", "Annual Leave", "Sick Leave", "Absent"].map(
                  (status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={tempFilters.status.includes(status)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={() => {
                        setTempFilters((prev) => {
                          const exists = prev.status.includes(status);
                          return {
                            ...prev,
                            status: exists
                              ? prev.status.filter((item) => item !== status)
                              : [...prev.status, status],
                          };
                        });
                      }}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  )
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Approval Status</DropdownMenuLabel>
                {["Approved", "Pending", "Rejected"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={tempFilters.approvalStatus.includes(status)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => {
                      setTempFilters((prev) => {
                        const exists = prev.approvalStatus.includes(status);
                        return {
                          ...prev,
                          approvalStatus: exists
                            ? prev.approvalStatus.filter(
                                (item) => item !== status
                              )
                            : [...prev.approvalStatus, status],
                        };
                      });
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                {/* Clear Filters Button */}
                <div className="flex flex-col px-2 py-1 gap-[10px]">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      setFilters(tempFilters);
                      table.setColumnFilters(
                        Object.entries(tempFilters)
                          .filter(([_, value]) => value.length > 0)
                          .map(([key, value]) => ({
                            id: key,
                            value,
                          }))
                      );
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setTempFilters({
                        approvalStatus: [],
                        status: [],
                      });
                      table.setColumnFilters([]); // Clear all filters in the table
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-fit">
            <Button
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 3.125V11.875"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.125 7.5H11.875"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              onClick={() =>
                (window.location.href = "/checkclock/add")
              }
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="h-fit">
          <TableHeader className="bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getPaginationRowModel().rows.length > 0 ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-between mt-[10px]">
        {/* Select Rows */}
        <div className="flex items-center gap-[10px]">
          <p className="text-base font-medium">Showing</p>
          <Select
            onValueChange={handleRowsChange}
            defaultValue={rowsPerPage.toString()}
          >
            <SelectTrigger className="w-[72px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pagination */}
        <div className="flex">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  className="mx-[4px] w-[24px] h-[26px] !py-[6px] !px-[6px] border text-primary-900 bg-[#F5F5F5] shadow-xs hover:bg-primary-950 hover:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                />
              </PaginationItem>
              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
                const page = startPage + i;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      className={`inline-flex items-center justify-center mx-[4px] w-[24px] h-[26px] !py-[6px] !px-[6px] border text-primary-900 bg-[#F5F5F5] shadow-xs 
                                      ${
                                        page === currentPage
                                          ? "bg-primary-950 text-white"
                                          : "hover:bg-primary-950 hover:text-white"
                                      }
                                      dark:bg-input/30 dark:border-input dark:hover:bg-input/50`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  className="mx-[4px] w-[24px] h-[26px] !py-[6px] !px-[6px] border text-primary-900 bg-[#F5F5F5] shadow-xs hover:bg-primary-950 hover:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
