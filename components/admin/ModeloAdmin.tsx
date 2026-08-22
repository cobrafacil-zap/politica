"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Badge } from "@/components/ui/badge";
import { Music2, Pencil, Play, Plus, Trash2 } from "lucide-react";
import {
  createModelo,
  deleteModelo,
  updateModelo,
} from "@/app/admin/modelos/actions";
import { toast } from "sonner";
import {
  MODELO_CATEGORIES,
  MODELO_MEDIA_TYPES,
} from "@/lib/validation/modelo";

type Modelo = {
  id: string;
  title: string;
  description: string | null;
  category: (typeof MODELO_CATEGORIES)[number];
  media_type: (typeof MODELO_MEDIA_TYPES)[number];
  media_url: string;
  thumbnail_url: string | null;
  display_order: number;
  active: boolean;
};

const CATEGORY_LABELS: Record<(typeof MODELO_CATEGORIES)[number], string> = {
  social_media: "Social Media",
  jingles: "Jingle",
  videos: "Vídeo",
};

const CATEGORY_BADGE_VARIANT: Record<
  (typeof MODELO_CATEGORIES)[number],
  "default" | "secondary" | "outline"
> = {
  social_media: "default",
  jingles: "secondary",
  videos: "outline",
};

export function ModeloAdmin({ items }: { items: Modelo[] }) {
  const [editing, setEditing] = useState<Modelo | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updateModelo(editing.id, formData)
        : await createModelo(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Atualizado!" : "Criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este modelo?")) return;
    startTransition(async () => {
      const res = await deleteModelo(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Modelos</CardTitle>
          <CardDescription>
            Exemplos de Social Media (imagens), Jingles (MP3) e Vídeos (MP4)
            que aparecem na página /modelos como mostruário.
          </CardDescription>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo modelo
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum modelo ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex flex-1 items-center gap-4">
                  <Preview modelo={m} />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{m.title}</p>
                      <Badge variant={CATEGORY_BADGE_VARIANT[m.category]}>
                        {CATEGORY_LABELS[m.category]}
                      </Badge>
                      {!m.active && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    {m.description && (
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {m.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {m.media_type} · ordem {m.display_order}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(m)}
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(m.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {(creating || editing) && (
          <ModeloDialog
            modelo={editing}
            onSubmit={handleSubmit}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            pending={pending}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Preview({ modelo }: { modelo: Modelo }) {
  const cover = modelo.thumbnail_url ?? modelo.media_url;
  if (modelo.media_type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        <img
          src={cover}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
      {modelo.media_type === "audio" ? (
        <Music2 className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Play className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}

function ModeloDialog({
  modelo,
  onSubmit,
  onClose,
  pending,
}: {
  modelo: Modelo | null;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const initialKind =
    modelo?.media_type ??
    (modelo?.category === "jingles"
      ? "audio"
      : modelo?.category === "videos"
        ? "video"
        : "image");

  const [mediaUrl, setMediaUrl] = useState(modelo?.media_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(modelo?.thumbnail_url ?? "");
  const [mediaType, setMediaType] =
    useState<(typeof MODELO_MEDIA_TYPES)[number]>(initialKind);
  const [category, setCategory] =
    useState<(typeof MODELO_CATEGORIES)[number]>(
      modelo?.category ?? "social_media"
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {modelo ? "Editar modelo" : "Novo modelo"}
        </h2>
        <form action={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input name="title" defaultValue={modelo?.title ?? ""} required />
          </div>

          <div className="space-y-1">
            <Label>Descrição</Label>
            <textarea
              name="description"
              defaultValue={modelo?.description ?? ""}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Categoria</Label>
              <select
                name="category"
                value={category}
                onChange={(e) => {
                  const v = e.target.value as (typeof MODELO_CATEGORIES)[number];
                  setCategory(v);
                  // Sugere media_type coerente com a categoria
                  if (v === "jingles") setMediaType("audio");
                  if (v === "videos") setMediaType("video");
                  if (v === "social_media") setMediaType("image");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {MODELO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Tipo de mídia</Label>
              <select
                name="media_type"
                value={mediaType}
                onChange={(e) =>
                  setMediaType(
                    e.target.value as (typeof MODELO_MEDIA_TYPES)[number]
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="image">Imagem</option>
                <option value="audio">Áudio (MP3)</option>
                <option value="video">Vídeo (MP4)</option>
              </select>
            </div>
          </div>

          <ImageUploadField
            label="Arquivo principal"
            kind={mediaType}
            value={mediaUrl}
            onChange={setMediaUrl}
          />
          <input type="hidden" name="media_url" value={mediaUrl} />

          {mediaType !== "image" && (
            <div className="space-y-1">
              <ImageUploadField
                label="Capa do card (thumbnail)"
                kind="image"
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
              />
              <p className="text-xs text-muted-foreground">
                Essa imagem aparece no card da página /modelos e como
                capa antes do play no vídeo. Recomendado 1080×1080.
              </p>
            </div>
          )}
          <input
            type="hidden"
            name="thumbnail_url"
            value={mediaType === "image" ? "" : thumbnailUrl}
          />

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                name="display_order"
                type="number"
                defaultValue={modelo?.display_order ?? 0}
              />
            </div>
            <label className="flex items-center gap-2 self-end text-sm md:col-span-2">
              <input
                type="checkbox"
                name="active"
                defaultChecked={modelo?.active ?? true}
                className="h-4 w-4"
              />
              Ativo (visível no mostruário /modelos)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending || !mediaUrl}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
