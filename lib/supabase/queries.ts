import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type Settings = {
  id: number;
  company_name: string;
  whatsapp_number: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_label: string | null;
  about_text: string | null;
  contact_email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  active: boolean;
};

export type Combo = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  original_price_cents: number | null;
  whatsapp_message: string;
  display_order: number;
  active: boolean;
  featured: boolean;
  badge_text: string | null;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  client_name: string | null;
  year: number | null;
  category: string | null;
  display_order: number;
  active: boolean;
};

export type Testimonial = {
  id: string;
  client_name: string;
  role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  display_order: number;
  active: boolean;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
};

export type Step = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  active: boolean;
};

export type LandingData = {
  settings: Settings;
  services: Service[];
  combos: (Combo & { services: Service[] })[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  steps: Step[];
};

async function fetchLandingData(): Promise<LandingData> {
  const supabase = createClient();

  const [settingsRes, servicesRes, combosRes, comboServicesRes, portfolioRes, testimonialsRes, faqsRes, stepsRes] =
    await Promise.all([
      supabase.from("settings").select("*").eq("id", 1).single(),
      supabase.from("services").select("*").eq("active", true).order("display_order"),
      supabase.from("combos").select("*").eq("active", true).order("display_order"),
      supabase.from("combo_services").select("combo_id, service_id"),
      supabase.from("portfolio_items").select("*").eq("active", true).order("display_order"),
      supabase.from("testimonials").select("*").eq("active", true).order("display_order"),
      supabase.from("faqs").select("*").eq("active", true).order("display_order"),
      supabase.from("how_it_works_steps").select("*").eq("active", true).order("display_order"),
    ]);

  if (settingsRes.error) throw settingsRes.error;
  if (servicesRes.error) throw servicesRes.error;
  if (combosRes.error) throw combosRes.error;
  if (comboServicesRes.error) throw comboServicesRes.error;
  if (portfolioRes.error) throw portfolioRes.error;
  if (testimonialsRes.error) throw testimonialsRes.error;
  if (faqsRes.error) throw faqsRes.error;
  if (stepsRes.error) throw stepsRes.error;

  const servicesById = new Map((servicesRes.data ?? []).map((s) => [s.id, s]));
  const combos: (Combo & { services: Service[] })[] = (combosRes.data ?? []).map(
    (c) => ({
      ...c,
      services: (comboServicesRes.data ?? [])
        .filter((cs) => cs.combo_id === c.id)
        .map((cs) => servicesById.get(cs.service_id))
        .filter((s): s is Service => Boolean(s)),
    })
  );

  return {
    settings: settingsRes.data as Settings,
    services: servicesRes.data ?? [],
    combos,
    portfolio: portfolioRes.data ?? [],
    testimonials: testimonialsRes.data ?? [],
    faqs: faqsRes.data ?? [],
    steps: stepsRes.data ?? [],
  };
}

/**
 * Versão cacheada: revalidada quando algum server action chama revalidateTag('landing').
 */
export const getLandingData = unstable_cache(
  fetchLandingData,
  ["landing-data"],
  { tags: ["landing"], revalidate: 3600 }
);
