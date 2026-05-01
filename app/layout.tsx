import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Font Wheel",
  description: "Spin a wheel, land on a Google Font, see how it reads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
