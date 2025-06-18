"use client";
import useSWR from "swr";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { Employee } from "@/types/employee";
// import { CheckclockSetting } from "@/types/cksetting";
import { redirect } from "next/navigation";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token-employee")}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export function useProfilData() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/employee/profile`,
    fetcher
  );
  console.log("API raw data:", data, "error:", error);

  // Mapping langsung ke Employee, ambil nama bank, posisi, dan departemen dari relasi
  let employeeData: Employee | undefined = undefined;
  if (data && typeof data === "object") {
    employeeData = {
      id: data.id ?? null,
      user_id: data.user_id ?? null,
      ck_setting_id: data.ck_setting_id ?? null,
      company_id: data.company_id ?? null,
      employee_id: data.employee_id ?? null,
      nik: data.nik ?? null,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      position_id: data.position_id ?? null,
      department_id: data.department_id ?? null,
      address: data.address ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      birth_place: data.birth_place ?? null,
      birth_date: data.birth_date ?? null,
      education: data.education ?? null,
      religion: data.religion ?? null,
      marital_status: data.marital_status ?? null,
      citizenship: data.citizenship ?? null,
      gender: data.gender ?? null,
      blood_type: data.blood_type ?? null,
      salary: data.salary ?? null,
      contract_type: data.contract_type ?? null,
      contract_end: data.contract_end ?? null,
      bank_code: data.bank_code ?? null,
      account_number: data.account_number ?? null,
      join_date: data.join_date ?? null,
      exit_date: data.exit_date ?? null,
      employee_photo: data.employee_photo ?? null,
      employee_status: data.employee_status ?? null,
      created_at: data.created_at ?? null,
      updated_at: data.updated_at ?? null,
      position_name: data.position?.name ?? null, // ambil nama posisi dari relasi
      department_name: data.position?.department?.name ?? null, // ambil nama departemen dari relasi
      bank_name: data.bank?.name ?? null, // ambil nama bank dari relasi
      employee_photo_url: data.employee_photo_url ?? null,
    };
  }

  return {
    employeeData,
    loading: isLoading,
    error,
  };
}
