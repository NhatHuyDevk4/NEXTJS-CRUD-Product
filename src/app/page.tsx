import CTABanner from "@/components/cta-banner";
import Footer from "@/components/footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/pricing";

import ProductCart from "@/components/ProductCart";
import FAQ from "@/components/ui/faq";


export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4">
        <Hero />
        <ProductCart />
        <FAQ />
        <Pricing />
        <CTABanner />
      </div>
      <Footer />
    </>
  );
}
