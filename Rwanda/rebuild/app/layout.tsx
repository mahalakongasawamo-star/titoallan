import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "BIG | Bjarke Ingels Group",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
