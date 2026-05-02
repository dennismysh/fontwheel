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

const THEME_INIT = `
try {
  var t = localStorage.getItem('fontwheel.theme.v1');
  if (t !== 'colorful') t = 'bw';
  document.documentElement.setAttribute('data-theme', t);
} catch (_) {
  document.documentElement.setAttribute('data-theme', 'bw');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${patrickHand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
