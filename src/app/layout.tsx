import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lightning Payment App",
  description: "A simple NWC-powered app for checking balance, creating invoices, and paying Lightning invoices.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
