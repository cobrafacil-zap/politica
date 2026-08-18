import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Middleware de auth para o painel admin.
 *
 * Estrategia:
 * - NAO roda em /admin/login (login nao precisa de checagem; rodar getUser
 *   aqui causa loop de refresh no @supabase/ssr).
 * - getSession() em vez de getUser(): le apenas o cookie local, NAO chama
 *   /auth/v1/user. Isso evita o ciclo "refresh tenta atualizar cookie ->
 *   middleware recria response -> cookie perdido -> repete".
 * - Rotas admin (exceto /admin/login) exigem sessao; caso contrario
 *   redireciona para /admin/login com ?next=.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getSession() le os cookies sem chamar Supabase — sem refresh,
  // sem network call, sem risco de loop.
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url, { headers: response.headers });
  }

  return response;
}

export const config = {
  // Exclui /admin/login do matcher: o login nao deve passar por auth-check
  // e rodar getSession/getUser aqui causa o loop ERR_TOO_MANY_REDIRECTS.
  matcher: ["/admin/:path((?!login).*)"],
};
