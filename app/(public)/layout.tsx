import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Placeholder } from "@/components/landing/Placeholder";
import { CartProvider } from "@/components/landing/CartProvider";
import { getLandingData } from "@/lib/supabase/queries";

// Garante renderização dinâmica — depende de dados do Supabase em runtime.
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getLandingData();
  const whatsappNumber = settings.whatsapp_number;

  return (
    <CartProvider>
      <Placeholder
        show={!whatsappNumber}
        message="O WhatsApp ainda não foi configurado — os botões da página estão desabilitados."
      />
      <div className="flex min-h-screen flex-col">
        <Header
          companyName={settings.company_name}
          whatsappNumber={whatsappNumber}
          instagramUrl={settings.instagram_url}
          facebookUrl={settings.facebook_url}
          youtubeUrl={settings.youtube_url}
        />
        <main className="flex-1">{children}</main>
        <Footer
          companyName={settings.company_name}
          contactEmail={settings.contact_email}
          instagramUrl={settings.instagram_url}
          facebookUrl={settings.facebook_url}
          youtubeUrl={settings.youtube_url}
        />
      </div>
    </CartProvider>
  );
}