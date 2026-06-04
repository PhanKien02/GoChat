"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    const isXhrPollError = args.some(arg => 
      typeof arg === "string" && arg.includes("xhr poll error")
    );
    const isReactScriptTag = typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component");

    if (isReactScriptTag || isXhrPollError) {
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
