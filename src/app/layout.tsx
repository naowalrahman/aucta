import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import AuthProviderWrapper from "@/components/auth-provider-wrapper";
import ThemeProviderClient from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aucta",
  description: "A realtime web auction platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={`antialiased ${plusJakartaSans.variable}`}>
        <ThemeProviderClient>
          <AuthProviderWrapper>
            <Navbar />
            {children}
          </AuthProviderWrapper>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
