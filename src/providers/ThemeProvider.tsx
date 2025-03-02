"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const queryClient = new QueryClient();

  return (
    <NextThemesProvider
      {...props}
      defaultTheme="light"
      attribute="class"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />

        <Toaster position="top-center" />
      </SessionProvider>
    </NextThemesProvider>
  );
}
