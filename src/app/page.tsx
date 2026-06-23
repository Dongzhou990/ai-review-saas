import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { PainSection } from "@/components/landing/pain-points";
import { FeatureSection } from "@/components/landing/features";
import { CompareSection } from "@/components/landing/compare";
import { StepsSection } from "@/components/landing/steps";
import { PricingSection } from "@/components/landing/pricing";
import { CTASection } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { StickyCTA } from "@/components/landing/sticky-cta";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <PainSection />
      <FeatureSection />
      <CompareSection />
      <StepsSection />
      <PricingSection />
      <CTASection />
      <Footer />
      <StickyCTA />
    </div>
  );
}
