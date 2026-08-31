import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Arribion landing page CMS Dashboard",
  description: "Content management dashboard for Arribion - manage blogs, portfolio projects, and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#08080d] text-gray-200 antialiased">{children}</body>
    </html>
  );
}
