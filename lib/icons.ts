import {
  Music,
  Globe,
  Image as ImageIcon,
  Video,
  Target,
  Share2,
  MessageCircle,
  FileText,
  Wrench,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Music,
  Globe,
  Image: ImageIcon,
  Video,
  Target,
  Share2,
  MessageCircle,
  FileText,
  Wrench,
  Rocket,
};

/**
 * Retorna o componente de ícone do lucide-react a partir do nome salvo no banco.
 * Caso o nome não seja encontrado, retorna um fallback genérico.
 */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return MessageCircle;
  return MAP[name] ?? MessageCircle;
}
