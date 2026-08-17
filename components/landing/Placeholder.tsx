import Link from "next/link";
import { AlertCircle } from "lucide-react";

type Props = {
  show: boolean;
  message?: string;
};

/**
 * Banner amarelo visível quando o número de WhatsApp não está configurado.
 * Por padrão é discreto e some quando há número.
 */
export function Placeholder({ show, message }: Props) {
  if (!show) return null;
  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200"
    >
      <AlertCircle className="mr-1 inline h-3 w-3" />
      {message ?? "WhatsApp não configurado."}{" "}
      <Link
        href="/admin/configuracoes"
        className="font-medium underline underline-offset-2"
      >
        Configurar agora
      </Link>
    </div>
  );
}
