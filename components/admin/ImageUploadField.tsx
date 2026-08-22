"use client";

import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

type Kind = "image" | "audio" | "video";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  kind?: Kind;
};

const MAX_MB: Record<Kind, number> = { image: 5, audio: 20, video: 50 };
const ACCEPT: Record<Kind, string> = {
  image: "image/png,image/jpeg,image/webp,image/gif",
  audio: "audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/mp4",
  video: "video/mp4,video/webm,video/quicktime",
};

/**
 * Campo de upload para a tabela modelos.
 * Aceita image / audio / video conforme o `kind`.
 * Envia para /api/upload (bucket "portfolio") com o kind como hint.
 */
export function ImageUploadField({
  value,
  onChange,
  label = "Imagem",
  kind = "image",
}: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha no upload");
      onChange(data.url);
      toast.success("Arquivo enviado!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-2 text-center text-xs text-muted-foreground">
                {kind === "audio" ? "🎵 áudio" : "🎬 vídeo"}
                <br />
                <span className="text-[10px]">enviado</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remover"
              className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground shadow hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted text-xs text-muted-foreground">
            sem arquivo
          </div>
        )}

        <div className="flex-1 space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Enviando…" : value ? "Trocar arquivo" : "Fazer upload"}
            <input
              type="file"
              accept={ACCEPT[kind]}
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
          </label>

          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {kind === "image"
              ? "PNG, JPEG, WEBP ou GIF. Máximo 5 MB."
              : kind === "audio"
                ? "MP3, WAV ou M4A. Máximo 20 MB."
                : "MP4, WEBM ou MOV. Máximo 50 MB."}
          </p>
        </div>
      </div>
    </div>
  );
}
