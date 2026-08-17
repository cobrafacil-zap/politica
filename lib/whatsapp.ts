/**
 * Constrói um link wa.me com a mensagem opcional e placeholders.
 * Suporta {{chave}} na mensagem, substituído pelo valor correspondente.
 * Limpa caracteres não numéricos do número.
 */
export function buildWhatsAppLink(
  number: string | null | undefined,
  message: string,
  vars?: Record<string, string>
): string | null {
  if (!number) return null;
  const cleaned = number.replace(/\D/g, "");
  if (!cleaned) return null;
  let msg = message ?? "";
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      msg = msg.replaceAll(`{{${k}}}`, v);
    }
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`;
}
