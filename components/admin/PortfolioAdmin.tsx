"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { createPortfolio, updatePortfolio, deletePortfolio } from "@/app/admin/portfolio/actions";
import { toast } from "sonner";

type Item = {
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

export function PortfolioAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updatePortfolio(editing.id, formData)
        : await createPortfolio(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Atualizado!" : "Criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este item?")) return;
    startTransition(async () => {
      const res = await deletePortfolio(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Portfólio</CardTitle>
          <CardDescription>
            Cases e exemplos de campanhas. Faça upload de imagens para o Supabase Storage.
          </CardDescription>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo item
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum item ainda.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <li key={i.id} className="overflow-hidden rounded-lg border bg-card">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={i.image_url}
                    alt={i.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="font-semibold">{i.title}</p>
                  {i.client_name && (
                    <p className="text-xs text-muted-foreground">
                      {i.client_name}
                      {i.year ? ` · ${i.year}` : ""}
                    </p>
                  )}
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(i)} aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(i.id)} aria-label="Excluir">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {(creating || editing) && (
          <PortfolioDialog
            item={editing}
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

function PortfolioDialog({
  item,
  onSubmit,
  onClose,
  pending,
}: {
  item: Item | null;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha no upload");
      setImageUrl(data.url);
      toast.success("Imagem enviada!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {item ? "Editar item" : "Novo item de portfólio"}
        </h2>
        <form action={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input name="title" defaultValue={item?.title ?? ""} required />
          </div>

          <div className="space-y-1">
            <Label>Imagem</Label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="relative h-20 w-32 overflow-hidden rounded border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Enviando…" : "Upload de imagem"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
              </label>
            </div>
            <Input
              name="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1">
            <Label>Descrição</Label>
            <textarea
              name="description"
              defaultValue={item?.description ?? ""}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Cliente</Label>
              <Input name="client_name" defaultValue={item?.client_name ?? ""} />
            </div>
            <div className="space-y-1">
              <Label>Ano</Label>
              <Input
                name="year"
                type="number"
                defaultValue={item?.year ?? ""}
                placeholder="2024"
              />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Input name="category" defaultValue={item?.category ?? ""} placeholder="ex: Vereador" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                name="display_order"
                type="number"
                defaultValue={item?.display_order ?? 0}
              />
            </div>
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={item?.active ?? true}
                className="h-4 w-4"
              />
              Ativo
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
