import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Dose Health Clinical OS",
  description:
    "Premium clinical decision support dashboard for First Dose Health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
