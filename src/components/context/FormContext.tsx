"use client";

import React, { createContext, useContext, useState } from "react";

type FormContextProps = {
  errors: Record<string, string[]>;
  setErrors: (errors: Record<string, string[]>) => void;
  success: Record<string, string[]>;
  setSuccess: (errors: Record<string, string[]>) => void;
};

const FormContext = createContext<FormContextProps | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<Record<string, string[]>>({});

  return (
    <FormContext.Provider 
      value={{ 
        errors, 
        setErrors,
        success,
        setSuccess 
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within an FormProvider");
  }
  return context;
}