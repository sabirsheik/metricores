import "./globals.css";
import { AppProvider } from "@/lib/AppContext";
import { ToastProvider } from "@/components/calculator/Toast";
import RootLayoutClient from "./layout-client";

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
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
