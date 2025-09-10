"use client";

import React from "react";
import ClientLayout from "../components/layout/ClientLayout"; 
import SessionWrapper from "./SessionWrapper"; 


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <SessionWrapper>
        {children}
      </SessionWrapper>
    </ClientLayout>
  );
}
