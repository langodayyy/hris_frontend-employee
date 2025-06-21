"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "@/components/context/FormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PasswordInput from "./passwordInput";
import { toast } from "sonner";
import Cookies from "js-cookie";
import React from "react";
// import { useState } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "./dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Old password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

type Props = {
  onSuccess?: () => void;
};

const ChangePasswordForm: React.FC<Props> = ({ onSuccess }) => {
  const { setErrors } = useFormContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    // setLoading(true);

    const form = document.getElementById("passwordForm") as HTMLFormElement;
    const formData = new FormData(form);

    // Tambahkan _method agar Laravel tahu bahwa ini PATCH
    formData.append("_method", "PATCH");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/change-password`,
        {
          method: "PATCH", // Tetap pakai POST karena pakai _method
          headers: {
            Authorization: `Bearer ${Cookies.get("token-employee")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: oldPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      // toast.success("Password successfully updated");
      // setShowChangePasswordDialog(false);
    } catch (err) {
      let message = "Unknown error occurred";
      let messagesToShow: string[] = [];

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        const backendError = err as {
          message: string;
          errors?: Record<string, string[]>;
        };

        if (backendError.message.toLowerCase().includes("failed to fetch")) {
          message = "Unknown error occurred";
        } else {
          message = backendError.message;
        }

        messagesToShow = backendError.errors
          ? Object.values(backendError.errors).flat()
          : [message];
      } else {
        messagesToShow = [message];
      }

      // toast.error(
      //   <>
      //     <p className="text-red-700 font-bold">Error</p>
      //     {messagesToShow.map((msg, idx) => (
      //       <div key={idx} className="text-red-700">
      //         • {msg}
      //       </div>
      //     ))}
      //   </>,
      //   { duration: 30000 }
      // );

      // ALERT ERROR LANGSUNG
      messagesToShow.forEach((msg) => alert(msg));
    }
    // finally {
    //   setLoading(false);
    // }
  };
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
    const handleOpenChangePasswordDialog = useCallback(() => {
        setIsHeaderDropdownOpen(false);
        setShowChangePasswordDialog(true);
      }, []);

  return (
    <>
      <DropdownMenu
              // open={isHeaderDropdownOpen}
              // onOpenChange={setIsHeaderDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-fit h-fit"
                    icon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  ></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit h-fit">
                  <DropdownMenuItem
                    className="w-full h-fit cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenChangePasswordDialog();
                    }}
                  >
                    Change password
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

      {/* Change Password Dialog */}
      <Dialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      >
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-3">
            <form id="passwordForm">
              <PasswordInput
                label="Old Password"
                id="currentPassword"
                placeholder="Enter your old password"
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
              />
              <PasswordInput
                label="New Password"
                // name="newPassword"
                id="newPassword"
                placeholder="Enter your new password"
                // value={setNewPassword}
                // onChange={(e) => setNewPassword(e.target.value)}
                {...register("newPassword")}
                error={errors.newPassword?.message}
              />
              <PasswordInput
                label="Confirmation New Password"
                // name="confirmPassword"
                id="confirmPassword"
                placeholder="Enter your new password again"
                // value={setConfirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
                  {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
              />
            </form>
          </div>
          <DialogFooter>
            <div className="flex flex-row gap-3.5 justify-end mt-4">
              <DialogClose asChild>
                <Button variant={"outline"} className="w-fit">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant={"default"}
                className="w-fit h-fit"
                onClick={changePassword}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <form onSubmit={handleSubmit(changePassword)} className="grid gap-4 mt-3">
        <PasswordInput
          label="Old Password"
          id="currentPassword"
          placeholder="Enter your old password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />

        <PasswordInput
          label="New Password"
          id="newPassword"
          placeholder="Enter your new password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />

        <PasswordInput
          label="Confirmation New Password"
          id="confirmPassword"
          placeholder="Enter your new password again"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form> */}
    </>
  );
};

export default ChangePasswordForm;
