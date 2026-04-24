"use client";

import Navigation from "./Navigation";
import VideoHero from "./VideoHero";
import ModelShowcase from "./ModelShowcase";
import BespokeSection from "./BespokeSection";
import WhispersSection from "./WhispersSection";
import RRFooter from "./RRFooter";

export default function Home() {
  return (
    <div className="bg-rr-black text-white min-h-screen">
      <Navigation />
      <VideoHero />
      <ModelShowcase />
      <BespokeSection />
      <WhispersSection />
      <RRFooter />
    </div>
  );
}
