"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Music2, Play, X } from "lucide-react";
import type { Modelo, ModeloCategory } from "@/lib/supabase/queries";

type Tab = ModeloCategory | "all";

const TABS: { key: Tab; label: string; icon: typeof ImageIcon }[] = [
  { key: "all", label: "Tudo", icon: ImageIcon },
  { key: "social_media", label: "Social Media", icon: ImageIcon },
  { key: "jingles", label: "Jingles", icon: Music2 },
  { key: "videos", label: "Vídeos", icon: Play },
];

type Props = {
  socialMedia: Modelo[];
  jingles: Modelo[];
  videos: Modelo[];
};

// Cor da etiqueta por categoria.
// Mantém o amarelo pra jingle (combina com o megafone da capa) e
// azul pra vídeo (contraste forte com o verde do site).
const CATEGORY_LABEL_CLASS: Record<ModeloCategory, string> = {
  social_media: "bg-primary text-primary-foreground",
  jingles: "bg-amber-400 text-amber-950",
  videos: "bg-sky-500 text-white",
};

const CATEGORY_LABEL_TEXT: Record<ModeloCategory, string> = {
  social_media: "Social Media",
  jingles: "Jingle",
  videos: "Vídeo",
};

export function ModelosView({ socialMedia, jingles, videos }: Props) {
  const [active, setActive] = useState<Tab>("all");
  const [lightbox, setLightbox] = useState<Modelo | null>(null);

  const all: Modelo[] = [...socialMedia, ...jingles, ...videos];
  const visible =
    active === "all"
      ? all
      : active === "social_media"
        ? socialMedia
        : active === "jingles"
          ? jingles
          : videos;

  const totals: Record<ModeloCategory, number> = {
    social_media: socialMedia.length,
    jingles: jingles.length,
    videos: videos.length,
  };

  return (
    <>
      {/* Hero curto */}
      <section className="border-b bg-foreground py-20 text-background md:py-28">
        <div className="container text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-background/20 bg-background/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-background">
            <ImageIcon className="h-3 w-3" /> Modelos prontos
          </span>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tighter md:text-6xl">
            O que a gente já fez.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-background/70">
            Exemplos reais de posts para redes, jingles e vídeos que
            produzimos para campanhas que confiaram na gente.
          </p>

          {/* Abas */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.key === "all"
                  ? all.length
                  : tab.key === "social_media"
                    ? totals.social_media
                    : tab.key === "jingles"
                      ? totals.jingles
                      : totals.videos;
              const selected = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={
                    "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors " +
                    (selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-background/20 bg-background/5 text-background hover:bg-background/10")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span
                    className={
                      "rounded-full px-2 text-xs " +
                      (selected ? "bg-primary-foreground/20" : "bg-background/10")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="bg-background py-20 md:py-28">
        <div className="container">
          {visible.length === 0 ? (
            <EmptyState category={active} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((m) => (
                <li key={m.id}>
                  <ModeloCard modelo={m} onOpen={setLightbox} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Lightbox unificado: imagem / áudio / vídeo */}
      {lightbox && <Lightbox modelo={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function EmptyState({ category }: { category: Tab }) {
  const label =
    category === "all"
      ? "modelos"
      : category === "social_media"
        ? "posts de Social Media"
        : category === "jingles"
          ? "jingles"
          : "vídeos";
  return (
    <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-foreground/20 px-6 py-16 text-center">
      <p className="font-display text-2xl font-bold">Em breve</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Ainda não temos {label} cadastrados. Volte em alguns dias — o time está
        produzindo material novo toda semana.
      </p>
    </div>
  );
}

type CardProps = {
  modelo: Modelo;
  onOpen: (m: Modelo) => void;
};

function ModeloCard({ modelo, onOpen }: CardProps) {
  const fallback =
    modelo.category === "jingles"
      ? "/capas/jingles.svg"
      : modelo.category === "videos"
        ? "/capas/videos.svg"
        : null;
  const [coverSrc, setCoverSrc] = useState<string | null>(
    modelo.thumbnail_url ?? modelo.media_url ?? fallback
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card transition-colors hover:border-primary">
      {/* Capa — clique abre lightbox (imagem, áudio ou vídeo) */}
      <button
        type="button"
        onClick={() => onOpen(modelo)}
        className="relative aspect-[4/3] cursor-zoom-in overflow-hidden bg-muted text-left"
        aria-label={`Abrir ${modelo.title}`}
      >
        {modelo.media_type === "image" ? (
          <Image
            src={coverSrc ?? ""}
            alt={modelo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => fallback && setCoverSrc(fallback)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc ?? ""}
            alt={modelo.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => fallback && setCoverSrc(fallback)}
          />
        )}

        {/* Botão play no centro pra áudio/vídeo */}
        {modelo.media_type !== "image" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:bg-black/50">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-transform group-hover:scale-110">
              {modelo.media_type === "audio" ? (
                <Music2 className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </span>
          </div>
        )}

        <span
          className={
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider " +
            CATEGORY_LABEL_CLASS[modelo.category]
          }
        >
          {CATEGORY_LABEL_TEXT[modelo.category]}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-lg font-bold leading-tight">
          {modelo.title}
        </h3>
        {modelo.description && (
          <p className="text-sm text-muted-foreground">{modelo.description}</p>
        )}
      </div>
    </article>
  );
}

function Lightbox({
  modelo,
  onClose,
}: {
  modelo: Modelo;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={modelo.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg hover:bg-background"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {modelo.media_type === "image" && (
          <div className="relative flex max-h-[80vh] w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modelo.media_url}
              alt={modelo.title}
              className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        )}

        {modelo.media_type === "audio" && (
          <div className="w-full max-w-xl rounded-2xl bg-background p-8 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modelo.thumbnail_url ?? "/capas/jingles.svg"}
              alt=""
              className="mb-6 aspect-square w-full rounded-xl object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/capas/jingles.svg";
              }}
            />
            <audio
              controls
              autoPlay
              preload="metadata"
              className="w-full"
              aria-label={modelo.title}
            >
              <source src={modelo.media_url} />
              Seu navegador não suporta áudio embutido.
            </audio>
          </div>
        )}

        {modelo.media_type === "video" && (
          <video
            controls
            autoPlay
            preload="metadata"
            playsInline
            poster={modelo.thumbnail_url ?? "/capas/videos.svg"}
            className="max-h-[80vh] w-full rounded-lg bg-black shadow-2xl"
          >
            <source src={modelo.media_url} />
            Seu navegador não suporta vídeo embutido.
          </video>
        )}

        <div className="text-center text-background">
          <p className="font-display text-lg font-bold">{modelo.title}</p>
          {modelo.description && (
            <p className="mt-1 text-sm text-background/70">{modelo.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
