import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/lib/AppContext";
import { ToastProvider } from "@/components/calculator/Toast";
import { Toaster } from "sonner";
import RootLayoutClient from "./layout-client";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>
          <ToastProvider>
            <RootLayoutClient>{children}</RootLayoutClient>
            <Toaster />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
