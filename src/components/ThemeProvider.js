"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = useState(false);

  // Force the theme provider to wait until the client has fully loaded
  // This completely stops Next.js from panicking about server-side scripts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}