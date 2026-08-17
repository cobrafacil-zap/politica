import { getLandingData } from "@/lib/supabase/queries";
import { Hero } from "@/components/landing/Hero";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PortfolioGrid } from "@/components/landing/PortfolioGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { CombosSection } from "@/components/landing/CombosSection";

export const revalidate = false; // revalidação por tag

export default async function LandingPage() {
  const data = await getLandingData();

  return (
    <>
      <Hero
        title={data.settings.hero_title ?? `Marketing digital para quem quer vencer a eleição`}
        subtitle={
          data.settings.hero_subtitle ??
          "Jingle, site, flyer, edição de vídeo, tráfego pago e social media. Tudo em um lugar."
        }
        ctaLabel={data.settings.hero_cta_label ?? "Falar no WhatsApp"}
        whatsappNumber={data.settings.whatsapp_number}
        companyName={data.settings.company_name}
      />
      <ServicesGrid services={data.services} />
      <CombosSection
        combos={data.combos}
        whatsappNumber={data.settings.whatsapp_number}
        companyName={data.settings.company_name}
      />
      <HowItWorks steps={data.steps} />
      <PortfolioGrid items={data.portfolio} />
      <Testimonials items={data.testimonials} />
      <FAQ items={data.faqs} />
      <FinalCTA
        whatsappNumber={data.settings.whatsapp_number}
        companyName={data.settings.company_name}
        aboutText={data.settings.about_text}
      />
    </>
  );
}
