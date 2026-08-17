import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { getLandingData } from "@/lib/supabase/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getLandingData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        companyName={settings.company_name}
        whatsappNumber={settings.whatsapp_number}
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
  );
}
