import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plant X Energy Advisor",
  description: "Illustrative advisory prototype. Humans approve every change.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
