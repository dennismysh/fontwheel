import type { Metadata } from "next";
import { Caveat, Inter, Patrick_Hand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-sketch",
  weight: ["500", "700"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-sketch-fallback",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Font Wheel",
  description: "Spin a wheel, land on a Google Font, see how it reads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${patrickHand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
