"use client";

import React from "react";
import ClientLayout from "../components/layout/ClientLayout"; // Adjust path as needed
import SessionWrapper from "./SessionWrapper"; // If it's also a client component


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <SessionWrapper>
        {children}
      </SessionWrapper>
    </ClientLayout>
  );
}
