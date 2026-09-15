import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/lib/AppContext";
import { ToastProvider } from "@/components/calculator/Toast";
import { Toaster } from "sonner";
import RootLayoutClient from "./layout-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.metricores.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Metricores",
    template: "%s | Metricores",
  },
  description:
    "Professional calculator tools for mortgage, age, scientific, and personal finance planning.",
  applicationName: "Metricores",
  openGraph: {
    title: "Metricores",
    description:
      "Professional calculator tools for mortgage, age, scientific, and personal finance planning.",
    url: siteUrl,
    siteName: "Metricores",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metricores",
    description:
      "Professional calculator tools for mortgage, age, scientific, and personal finance planning.",
  },
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
