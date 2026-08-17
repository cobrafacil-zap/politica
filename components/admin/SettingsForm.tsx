"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/app/admin/configuracoes/actions";
import { toast } from "sonner";

type Initial = {
  company_name?: string;
  whatsapp_number?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta_label?: string | null;
  about_text?: string | null;
  contact_email?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  youtube_url?: string | null;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await updateSettings(formData);
      if (res.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Configurações salvas!");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do site</CardTitle>
        <CardDescription>
          Edite o nome da empresa, número de WhatsApp e textos principais da landing.
          O número de WhatsApp é obrigatório para os botões aparecerem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da empresa</Label>
              <Input
                id="company_name"
                name="company_name"
                defaultValue={initial.company_name ?? ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp (somente dígitos, com DDI)</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                defaultValue={initial.whatsapp_number ?? ""}
                placeholder="5511999999999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_title">Título principal (Hero)</Label>
            <Input
              id="hero_title"
              name="hero_title"
              defaultValue={initial.hero_title ?? ""}
              placeholder="Marketing digital para quem quer vencer a eleição"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Subtítulo (Hero)</Label>
            <Input
              id="hero_subtitle"
              name="hero_subtitle"
              defaultValue={initial.hero_subtitle ?? ""}
              placeholder="Jingle, site, flyer…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_cta_label">Texto do botão CTA</Label>
            <Input
              id="hero_cta_label"
              name="hero_cta_label"
              defaultValue={initial.hero_cta_label ?? "Falar no WhatsApp"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_text">Texto do CTA final (Sobre)</Label>
            <textarea
              id="about_text"
              name="about_text"
              defaultValue={initial.about_text ?? ""}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="contact_email">E-mail de contato</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={initial.contact_email ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram (URL)</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                defaultValue={initial.instagram_url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook (URL)</Label>
              <Input
                id="facebook_url"
                name="facebook_url"
                type="url"
                defaultValue={initial.facebook_url ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube (URL)</Label>
            <Input
              id="youtube_url"
              name="youtube_url"
              type="url"
              defaultValue={initial.youtube_url ?? ""}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
