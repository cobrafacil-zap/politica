"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Music2, Play } from "lucide-react";
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

export function ModelosView({ socialMedia, jingles, videos }: Props) {
  const [active, setActive] = useState<Tab>("all");

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
            Mostruário de campanha.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-background/70">
            Posts para redes, jingles e vídeos prontos para personalizar com o
            nome e a cara do candidato.
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
                  <ModeloCard modelo={m} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
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

function ModeloCard({ modelo }: { modelo: Modelo }) {
  const cover = modelo.thumbnail_url ?? modelo.media_url;
  const isImage = modelo.media_type === "image";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card transition-colors hover:border-primary">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {isImage ? (
          <Image
            src={cover}
            alt={modelo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={modelo.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {!isImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg">
              {modelo.media_type === "audio" ? (
                <Music2 className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          {labelFor(modelo.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-lg font-bold leading-tight">
          {modelo.title}
        </h3>
        {modelo.description && (
          <p className="text-sm text-muted-foreground">{modelo.description}</p>
        )}

        {modelo.media_type === "audio" && (
          <audio controls preload="none" className="w-full">
            <source src={modelo.media_url} />
          </audio>
        )}
        {modelo.media_type === "video" && (
          <video controls preload="none" className="w-full rounded-md">
            <source src={modelo.media_url} />
          </video>
        )}
      </div>
    </article>
  );
}

function labelFor(category: ModeloCategory): string {
  if (category === "social_media") return "Social Media";
  if (category === "jingles") return "Jingle";
  return "Vídeo";
}
