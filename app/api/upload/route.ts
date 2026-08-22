import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

// Tipos permitidos por categoria de modelo.
// ?kind=image (default) | audio | video
const ALLOWED: Record<string, { mimes: Set<string>; maxBytes: number; folder: string }> = {
  image: {
    mimes: new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]),
    maxBytes: 5 * 1024 * 1024, // 5 MB
    folder: "images",
  },
  audio: {
    mimes: new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-m4a", "audio/mp4"]),
    maxBytes: 20 * 1024 * 1024, // 20 MB
    folder: "audio",
  },
  video: {
    mimes: new Set(["video/mp4", "video/webm", "video/quicktime"]),
    maxBytes: 50 * 1024 * 1024, // 50 MB
    folder: "video",
  },
};

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  const kind = (formData.get("kind") as string) || "image";
  const cfg = ALLOWED[kind];
  if (!cfg) {
    return NextResponse.json(
      { error: "Tipo de envio inválido (use image, audio ou video)" },
      { status: 400 }
    );
  }

  // Alguns browsers enviam "audio/mp3" como "audio/mpeg"; normaliza.
  const normalizedType =
    file.type === "audio/mp3" ? "audio/mpeg" : file.type;

  if (!cfg.mimes.has(normalizedType)) {
    return NextResponse.json(
      { error: `Tipo de arquivo não permitido (${kind})` },
      { status: 400 }
    );
  }

  if (file.size > cfg.maxBytes) {
    return NextResponse.json(
      { error: `Arquivo maior que ${Math.round(cfg.maxBytes / 1024 / 1024)} MB` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `${cfg.folder}/${randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(filename, buffer, { contentType: normalizedType, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
