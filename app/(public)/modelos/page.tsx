import { getModelos } from "@/lib/supabase/queries";
import { ModelosView } from "@/components/landing/ModelosView";

// Página pública de modelos: Social Media, Jingles e Vídeos.
// Mantém o mesmo padrão dark/green da landing.
export const dynamic = "force-dynamic";

export default async function ModelosPage() {
  const grouped = await getModelos();

  return (
    <ModelosView
      socialMedia={grouped.social_media}
      jingles={grouped.jingles}
      videos={grouped.videos}
    />
  );
}
