/**
 * Formata um valor em centavos para a moeda brasileira (R$ 1.499,00).
 */
export function formatBRL(cents: number | null | undefined): string {
  if (cents == null) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Slugify simples: remove acentos, baixa caixa, troca espaços por hífens.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
