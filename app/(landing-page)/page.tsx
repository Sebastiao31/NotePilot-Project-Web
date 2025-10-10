

import React from "react";
import HeroSection from "@/components/landingPage/hero-section";
import Ticker from "@/components/landingPage/ticker";
import FeaturesSection from "@/components/landingPage/features-section";
import HIWSection from "@/components/landingPage/HIW-section";
import FAQSection from "@/components/landingPage/FAQ-section";
import Testimonials from "@/components/landingPage/testimonials";
import Footer from "@/components/landingPage/footer";
import CTASection from "@/components/landingPage/CTA-section";

export default function Home() {
  return (
    <main className="max-w-[1440px] mx-auto bg-white ">
      <div>
        <HeroSection />
      </div>

      <div>
        <Ticker />
      </div>

      <div>
        <FeaturesSection />
      </div>

      <div>
        <HIWSection />
      </div>

      <div>
        <Testimonials />
      </div>

      <div>
        <FAQSection />
      </div>



      <div>
        <Footer />
      </div>

    </main>
  );
}
