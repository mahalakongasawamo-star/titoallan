import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rolls-Royce Motor Cars | Inspiring Greatness",
  description:
    "Explore the world of Rolls-Royce Motor Cars — Phantom, Spectre, Ghost, Cullinan and Bespoke. The pinnacle of luxury automotive excellence.",
};

export default function RollsRoyceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Override the parent layout's cursor-none and hide the parent Header.
        This stylesheet scopes to the Rolls-Royce route only.
      */}
      <style>{`
        /* Restore default cursor on the RR page */
        * { cursor: auto !important; }
        a, button, [role="button"] { cursor: pointer !important; }

        /* Hide the parent layout's header (UpServ) */
        body > div > header:first-of-type,
        body > header:first-of-type {
          display: none !important;
        }

        /* Hide the custom cursor follower from the parent layout */
        .cursor-follower,
        [data-cursor-follower] {
          display: none !important;
        }

        /* Set Montserrat as the page font */
        body {
          font-family: var(--font-montserrat), Montserrat, system-ui, sans-serif !important;
          background: #050505 !important;
          color: #fff !important;
        }

        /* Ensure smooth scroll */
        html { scroll-behavior: smooth; }
      `}</style>

      <div className={`${montserrat.variable}`} style={{ fontFamily: "var(--font-montserrat), Montserrat, system-ui, sans-serif" }}>
        {children}
      </div>
    </>
  );
}
