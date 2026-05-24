import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";

const space_grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
