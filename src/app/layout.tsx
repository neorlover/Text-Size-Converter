import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Text Size Converter",
  description:
    "Modern text size converter for pixels, rem, and points with responsive Bootstrap UI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-bs-theme="auto">
      <body className={`${inter.className} bg-body-tertiary`}>{children}</body>
    </html>
  );
}
