import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";
import { AppToaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Modern finance SaaS dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
