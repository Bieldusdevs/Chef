import { Hero } from "@/components/layout/hero";
import { Navbar } from "@/components/layout/navbar";
import { Features } from "@/components/layout/features";
import { HowItWorks } from "@/components/layout/how-it-works";
import { Pricing } from "@/components/layout/pricing";
import { Testimonials } from "@/components/layout/testimonials";
import { CTA } from "@/components/layout/cta";
import { Footer } from "@/components/layout/footer";
import { RecipeResult } from "@/components/recipe/recipe-result";
import { GeneratingOverlay } from "@/components/recipe/generating-overlay";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <GeneratingOverlay />
      <RecipeResult />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
