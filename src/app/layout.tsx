import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Spendly - Personal Finance Tracker",
  description: "Track your income and expenses with Spendly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0B0D14] text-gray-200" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#252A36',
                color: '#fff',
                border: '1px solid #334155'
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
