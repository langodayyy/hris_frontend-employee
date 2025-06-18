"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FileUploader } from "../ui/fileUploader";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRouter } from "next/navigation";
import * as React from "react";
import { TimeInput } from "../ui/timeInput";
import { useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie";
import { Spinner } from "../ui/spinner";
import {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogFooter,
        DialogClose,
  } from "@/components/ui/dialog";

const OvertimeForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preventRedirect, setPreventRedirect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileDrop = (files: File[]) => {
      if (files.length > 0 && fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          fileInputRef.current.files = dataTransfer.files;
      }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      if (!formRef.current) return;

      const formData = new FormData(formRef.current);
      if (selectedDate){
        formData.append("date", selectedDate.toLocaleDateString('sv-SE'));
      }
     
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/overtime`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Cookies.get("token-employee")}`,
          },
          body: formData,
    });


    const responseData = await response.json();
    if (!response.ok) {
        throw responseData; 
    }
    toast.success('Overtime created successfully')
    setSuccess(true);
    // setSuccess(true);
    // router.push("/overtime/management")
    } catch (err) {
    // setError(true);
    let message = "Unknown error occurred";
    let messagesToShow: string[] = [];

    if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as any).message === "string"
    ) {
    const backendError = err as { message: string; errors?: Record<string, string[]> };

    if (backendError.message.toLowerCase().includes("failed to fetch")) {
        message = "Unknown error occurred";
    } else {
        message = backendError.message;
    }

    messagesToShow = backendError.errors
        ? Object.values(backendError.errors).flat()
        : [message];
    } else {
    messagesToShow = [message]
    }

    toast.error(
        <>
            <p className="text-red-700 font-bold">Error</p>
            {messagesToShow.map((msg, idx) => (
            <div key={idx} className="text-red-700">• {msg}</div>
            ))}
        </>,
        { duration: 30000 }
    );
    } finally {
    setLoading(false);
    }
  };

  return (
    <form  ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
    >
      <Card className="w-full p-5 gap-6 flex flex-col">
        <div className="flex gap-6">
          {/* Overtime Date */}
          <div className="flex flex-col gap-4 w-full">
            <Label>Overtime Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"calendar"}
                  className={cn(
                    "w-full h-[46px] justify-start text-left font-normal text-neutral-900 border-neutral-300",
                    !selectedDate && "text-neutral-300"
                  )}
                >
                  <CalendarIcon />
                  {selectedDate ? (
                    format(selectedDate, "dd/MM/yyyy")
                  ) : (
                    <span>dd/mm/yyyy</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="flex flex-col w-full">
                <TimeInput label={"Start Hour"} name={"start_hour"}></TimeInput>
            </div>
            <div className="flex flex-col w-full gap-2">
              <TimeInput label={"End Hour"} name={"end_hour"}></TimeInput>
            </div>
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-2">
          <Label>Upload Supporting Evidence</Label>
          <FileUploader
            onDrop={handleFileDrop}
            accept={{ "image/png": [], "image/jpeg": [], "image/jpg": [] }}
            type="Only support .png, .jpg, .jpeg"
          />
          <input
              type="file"
              name="evidence"
              // accept=".csv"
              ref={fileInputRef}
          
              hidden
          />
        </div>
        <div className="flex flex-row gap-[15px] justify-end items-center">
          <Button
            variant="outline"
            className="w-[98px]"
            onClick={() => router.push("/overtime")}
            disabled={loading}
          >
            {!loading ? (
              <>
              <span>Cancel</span>
              </>
            ) : (
              <Spinner size="small" />
          )}
          </Button>
          <Button type="submit" variant="default" className="w-[98px]" disabled={loading}>
           {!loading ? (
                <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 3V8H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-1">Save</span>
                </>
            ) : (
                <Spinner size="small" />
            )}
          </Button>
        </div>
        <Dialog
          open={success}
          onOpenChange={(open) => {
              if (!open) {
              setSuccess(false);

              if (!preventRedirect) {
                  // Jika bukan karena tombol Add Another Document, redirect
                  router.push(`/overtime`);
              } else {
                  // reset flag supaya dialog bisa redirect normal di lain waktu
                  setPreventRedirect(false);
              }
              }
          }}
          >
          <DialogContent className="bg-white max-w-sm mx-auto">
              <DialogHeader>
              <DialogTitle>{success ? "Success!" : "Error"}</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
              {success && <p >Add another overtime?</p>}
              </div>
              <DialogFooter className="mt-4 flex gap-2 justify-end">
              {success && (
                  <div className="flex gap-2 justify-end w-full">
                  <Button
                      variant="outline"
                      className="max-w-[180px] whitespace-nowrap"
                      onClick={() => {
            
                      window.location.reload();
                      setPreventRedirect(true);
                      }}
                  >
                      Add Another overtime
                  </Button>
                  <DialogClose asChild>
                      <Button variant="default" className="max-w-[180px] whitespace-nowrap">Close</Button>
                  </DialogClose>
                  </div>
              )}
              </DialogFooter>
          </DialogContent>
          </Dialog>
      </Card>

      
    </form>
  );
};

export default OvertimeForm;
