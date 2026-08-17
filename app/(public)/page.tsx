import { getLandingData } from "@/lib/supabase/queries";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ServicesMenu } from "@/components/landing/ServicesMenu";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PortfolioGrid } from "@/components/landing/PortfolioGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { CombosSection } from "@/components/landing/CombosSection";
import { Cart } from "@/components/landing/Cart";

export const revalidate = false; // revalidação por tag

export default async function LandingPage() {
  const data = await getLandingData();

  const whatsappNumber = data.settings.whatsapp_number;
  const companyName = data.settings.company_name;

  return (
    <>
      <Hero
        title={data.settings.hero_title ?? `Marketing digital para quem quer vencer a eleição`}
        subtitle={
          data.settings.hero_subtitle ??
          "Jingle, site, flyer, edição de vídeo, tráfego pago e social media. Tudo em um lugar."
        }
        ctaLabel={data.settings.hero_cta_label ?? "Falar no WhatsApp"}
        whatsappNumber={whatsappNumber}
        companyName={companyName}
        heroImageUrl={data.settings.hero_image_url}
      />

      <TrustBar
        campaigns={data.settings.stats_campaigns}
        states={data.settings.stats_states}
        satisfaction={data.settings.stats_satisfaction}
      />

      <ServicesMenu services={data.services} />

      <CombosSection combos={data.combos} />

      <HowItWorks steps={data.steps} />

      <PortfolioGrid items={data.portfolio} />

      <Testimonials items={data.testimonials} />

      <FAQ items={data.faqs} />

      <FinalCTA
        whatsappNumber={whatsappNumber}
        companyName={companyName}
        aboutText={data.settings.about_text}
      />

      <Cart
        services={data.services}
        whatsappNumber={whatsappNumber}
        companyName={companyName}
      />
    </>
  );
}