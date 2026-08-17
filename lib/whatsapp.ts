import { formatBRL } from "@/lib/format";

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

type CartItem = { id: string; name: string; price_cents: number };

/**
 * Monta a mensagem de WhatsApp com a lista de serviços selecionados.
 */
export function buildCartMessage(
  companyName: string,
  items: CartItem[]
): string {
  const lines = items.map((i) => `✅ ${i.name} — ${formatBRL(i.price_cents)}`);
  const total = items.reduce((acc, i) => acc + i.price_cents, 0);
  return [
    `Olá! Tenho interesse nos seguintes serviços da ${companyName}:`,
    "",
    ...lines,
    "",
    `Total: ${formatBRL(total)}`,
    "",
    "Podemos conversar sobre os próximos passos?",
  ].join("\n");
}
