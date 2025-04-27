"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-plus-jakarta-sans)",
  },
});

export default function ThemeProviderClient({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
