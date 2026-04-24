import InteractiveHero from "@/components/InteractiveHero";
import ValuePropSection from "@/components/ValuePropSection";
import PricingSection from "@/components/PricingSection";
import FeatureSection from "@/components/FeatureSection";
import IndustrySection from "@/components/IndustrySection";
import FAQSection from "@/components/FAQSection";
import InsightsSection from "@/components/InsightsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Schema, {
  buildWebPageSchema,
  buildFAQPageSchema,
  buildArticleSchemas,
} from "@/components/Schema";

export default function Home() {
  return (
    <main>
      <Schema
        data={[
          buildWebPageSchema(),
          buildFAQPageSchema(),
          ...buildArticleSchemas(),
        ]}
      />
      <InteractiveHero />
      <ValuePropSection />
      <PricingSection />
      <FeatureSection />
      <IndustrySection />
      <FAQSection />
      <InsightsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
