import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import CursorFollower from "@/components/CursorFollower";
import { SITE_NAME, SITE_DESCRIPTION } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME.toLowerCase()}.ai | AI-Friendly Web Design`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
        <ThemeProvider>
          <CursorFollower />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
