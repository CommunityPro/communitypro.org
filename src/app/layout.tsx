import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css";

import { ErrorBoundary, QueryProvider } from "@/components/providers";
import { cn } from "@/lib";

const space_grotesk = Space_Grotesk({ style: ["normal"], subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ style: ["italic", "normal"], subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("h-full", "antialiased", space_grotesk.variable, inter.variable)}>
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
