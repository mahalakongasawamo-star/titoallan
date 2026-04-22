import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

// §11 + copy.md § Metadata
export const metadata: Metadata = {
  title: "BIG | Bjarke Ingels Group",
  robots: "noarchive",
  openGraph: {
    title: "BIG | Bjarke Ingels Group",
    siteName: "BIG | Bjarke Ingels Group",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://big.dk/share.jpg", width: 1012, height: 700 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIG | Bjarke Ingels Group",
    images: [
      {
        url: "https://big.dk/share.jpg",
        alt: "BIG | Bjarke Ingels Group",
        width: 1012,
        height: 700,
      },
    ],
  },
  other: {
    googlebot: "NOODP",
  },
};

export const viewport: Viewport = {
  themeColor: "white",
};

// copy.md § Structured data — JSON-LD Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bjarke Ingels Group",
  alternateName: "BIG",
  url: "https://big.dk",
  logo: "https://big.dk/favicon-32x32.png",
  description: "",
  foundingDate: "2005",
  founder: {
    "@type": "Person",
    name: "Bjarke Ingels",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
