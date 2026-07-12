import { Fira_Code, Raleway, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css";

import { AppProvider, ErrorBoundary, QueryProvider } from "@/components/providers";
import { AuthProvider } from "@/features/auth";

const space_grotesk = Space_Grotesk({ style: ["normal"], subsets: ["latin"], variable: "--font-space-grotesk" });
const raleway = Raleway({ style: ["italic", "normal"], subsets: ["latin"], variable: "--font-raleway" });
const fira_code = Fira_Code({ style: ["normal"], subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Community Pro",
  description: "A community platform for developers and tech enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${space_grotesk.variable} ${raleway.variable} ${fira_code.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <AppProvider>
              <ThemeProvider attribute="class" defaultTheme="light">
                {children}
              </ThemeProvider>
            </AppProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
