import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Shell } from "@/components/shell";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = { title: "بلدي | لوحة البلدية", description: "إدارة بلاغات المرافق العامة" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ar" dir="rtl"><body><Shell>{children}</Shell></body></html>;
}
