import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { session } from '@/lib/auth';
export async function GET(req) {
  const s = await session(req);
  if (!s?.permisos?.includes('bitacora:ver')) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 });
  const r = new URL(req.url).searchParams.get('resultado') || null;
  const rows = await sql`select * from bitacora_seguridad where (${r}::text is null or resultado=${r}) order by fecha desc limit 100`;
  return NextResponse.json({ rows });
}
