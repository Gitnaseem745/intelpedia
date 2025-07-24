"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export const ConditionalHeader = () => {
  const pathname = usePathname();
  
  // Hide header on admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Header />;
};
