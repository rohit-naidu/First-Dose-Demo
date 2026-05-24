import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Dose Health — Clinical Workstation",
  description: "Clinical decision support workstation for First Dose Health.",
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
