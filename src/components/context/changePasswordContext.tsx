// contexts/ChangePasswordContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type ChangePasswordContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChangePasswordContext = createContext<ChangePasswordContextType | undefined>(undefined);

export const ChangePasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChangePasswordContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ChangePasswordContext.Provider>
  );
};

export const useChangePassword = () => {
  const context = useContext(ChangePasswordContext);
  if (!context) {
    throw new Error("useChangePassword must be used within a ChangePasswordProvider");
  }
  return context;
};
