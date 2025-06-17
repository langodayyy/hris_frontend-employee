"use client";
import useSWR from "swr";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
// import { CheckclockSetting } from "@/types/cksetting";
import { redirect } from "next/navigation";

export type profileRule = {
  user_id : number;
  company_id : String;
  employee_id : String;
  nik : String;
  first_name : String;
  last_name : String;
  position_id : number;
  address : String;
  email : String;
  phone : String;
  birth_place : String;
  birth_date : String;
  education : String;
  religion : String;
  marital_status : String;
  citizenship : String;
  gender : String;
  blood_type : String;
  salary : String;
  contract_type : String;
  bank_code : String;
  account_number : String;
  contract_end : String;
  join_date : String;
  exit_date : String;
  employee_foto : String;
  employee_status : String;

};

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export function useProfilData() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/employee/profile`,
    fetcher
  );
  console.log("API raw data:", data, "error:", error);
 const profillData = data?.profillData ?? null;
  const profileRule = Array.isArray(data?.data)
    ? data.data.map((item: any) => ({
        user_id: item.user_id,
        company_id: item.company_id,
        employee_id: item.employee_id,
        nik: item.nik,
        first_name: item.first_name, 
        last_name: item.last_name,
        position_id: item.position_id,
        address: item.address,
        email: item.email, 
        phone: item.phone, 
        birth_place: item.birth_place, 
        birth_date: item.birth_date, 
        education: item.education, 
        religion: item.religion, 
        marital_status: item.marital_status, 
        citizenship: item.citizenship, 
        gender: item.gender, 
        blood_type: item.blood_type, 
        salary: item.salary, 
        contract_type: item.contract_type, 
        bank_code: item.bank_code, 
        account_number: item.account_number, 
        contract_end: item.contract_end, 
        join_date: item.join_date, 
        exit_date: item.exit_date, 
        employee_photo: item.employee_photo, 
        employee_status: item.employee_status, 
      }))
    : [];

  return {
    profillData,
    loading: isLoading,
    profileRule,
  };
}
