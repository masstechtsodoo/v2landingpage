import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Mass Tech Admin", template: "%s — Mass Tech Admin" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0b1828" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className="bg-paper">{children}</body>
    </html>
  );
}
