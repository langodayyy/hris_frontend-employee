"use client";
import useSWR from 'swr';
import Cookies from "js-cookie";

export type LocationRule = {
  data_id: number;
  latitude: string;
  longitude: string;
  radius: string;
};

const fetcher = (url: string) => fetch(url, {
  headers: {
    Authorization: `Bearer ${Cookies.get("token-employee")}`,
    "Content-Type": "application/json",
  },
  method: "GET"
}).then(res => res.json());

export function useCKSettingData() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/check-clock`,
    fetcher,
  );

  const checkClockData = data?.check_clock_data ?? null;
  const locationRule = data?.location_rule?.[0]
  ? {
      data_id: data.location_rule[0].data_id || 0,
      latitude: data.location_rule[0].latitude || "0",
      longitude: data.location_rule[0].longitude || "0",
      radius: data.location_rule[0].radius || "0",
    }
    : null;
    
  return {
    checkClockData,
    locationRule,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}