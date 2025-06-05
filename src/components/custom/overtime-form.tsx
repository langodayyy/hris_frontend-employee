"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FileUploader } from "../ui/fileUploader";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRouter } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "@/components/context/FormContext";

const overtimeSchema = z.object({
  date: z.string({ required_error: "Please select a valid date." }),
  totalHours: z.preprocess(
    (val) => {
      if (
        val === "" ||
        val === null ||
        typeof val === "undefined" ||
        Number.isNaN(val)
      )
        return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({
        required_error: "Please enter the total number of overtime hours.",
        invalid_type_error: "Please enter the total number of overtime hours.",
      })
      .min(0, "Minimum 0 hour")
      .max(5, "Maximum 5 hours")
  ),
  supportingEvidence: z.string({
    required_error: "Please upload supporting evidence.",
  }),
});
type OvertimeFormData = z.infer<typeof overtimeSchema>;

const OvertimeForm: React.FC = () => {
  const router = useRouter();
  const { setErrors, setSuccess } = useFormContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(overtimeSchema),
  });

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const handleSave = () => {
    console.log("Data berhasil disimpan!");
    setSuccess({ overtime: ["Overtime submitted successfully!"] });
    router.push("/overtime");
  };

  const onSubmit = (data: OvertimeFormData) => {
    console.log("Form submitted successfully:", data);
    setSuccess({ overtime: ["Overtime submitted successfully!"] });
    // setSuccess({ attendance: ["Attendance submitted successfully!"] });
  };

  React.useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"), {
        shouldValidate: true,
      });
    }
  }, [selectedDate, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full p-5 gap-6 flex flex-col">
        <div className="flex gap-6">
          {/* Overtime Date */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Overtime Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"calendar"}
                  className={cn(
                    "w-full justify-start text-left font-normal py-3",
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
            {errors.date && (
              <p className="text-sm text-red-500 font-semibold">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Total Hours */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Total Hours</Label>
            <Input
              type="number"
              placeholder="Enter overtime duration (max 5 hours in one day)"
              step="1"
              min="0"
              max="5"
              className="no-spinner"
              {...register("totalHours", {
                valueAsNumber: true,
              })}
              onKeyDown={(e) => {
                const invalidChars = ["e", "E", "+", "-", ".", ","];
                if (invalidChars.includes(e.key)) e.preventDefault();
              }}
              onInput={(e) => {
                const input = e.currentTarget;
                if (parseInt(input.value) > 5) {
                  input.value = "5";
                }
              }}
            />

            {errors.totalHours && (
              <p className="text-sm text-red-500 font-semibold">
                {errors.totalHours.message}
              </p>
            )}
          </div>
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-2">
          <Label>Upload Supporting Evidence</Label>
          <FileUploader
            onDrop={(files) => {
              const file = files[0];
              if (file) {
                setValue("supportingEvidence", file.name, {
                  shouldValidate: true,
                });
              }
            }}
            accept={{ "image/png": [], "image/jpeg": [], "image/jpg": [] }}
            type="Only support .png, .jpg, .jpeg"
          />
          {errors.supportingEvidence && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.supportingEvidence.message}
            </span>
          )}
        </div>
      </Card>

      <div className="flex w-full gap-[15px] justify-end mt-6">
        <div className="w-[93px]">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
        <div className="w-[93px]">
          <Button type="submit" onClick={handleSave}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OvertimeForm;
