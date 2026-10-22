import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { MODS } from '@/lib/perms';
export const config = { matcher: ['/dashboard/:path*', '/api/usuarios', '/api/bitacora'] };
export async function middleware(req) {
  const { pathname } = req.nextUrl, api = pathname.startsWith('/api/');
  let s = null; const t = req.cookies.get('token')?.value;
  if (t) { try { s = (await jwtVerify(t, new TextEncoder().encode(process.env.JWT_SECRET))).payload; } catch {} }
  if (!s) return api ? NextResponse.json({ error: 'No autenticado' }, { status: 401 }) : NextResponse.redirect(new URL('/', req.url));
  const p = pathname.split('/').filter(Boolean), slug = p[1] === 'modulo' ? p[2] : p[1];
  const need = MODS[slug]?.perm;
  if (need && !s.permisos.includes(need))
    return api ? NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
               : NextResponse.redirect(new URL('/acceso-denegado?ruta=' + encodeURIComponent(pathname), req.url));
  return NextResponse.next();
}
