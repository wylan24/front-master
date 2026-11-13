import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // Match the reference: glyphs missing from the font (○, →) fall back to system-ui.
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Array Academy: Arrays from Zero",
  description: "Arrays from zero to advanced, in JavaScript.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
