"use client"; // Mark this file as a client component

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
