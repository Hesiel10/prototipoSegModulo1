import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
export async function GET(req) {
  if (!process.env.SETUP_KEY || new URL(req.url).searchParams.get('key') !== process.env.SETUP_KEY)
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const h = await bcrypt.hash('Andes2026!', 12);
  for (const [email, nombre, rol] of [['admin@andes.bo','Ana Administradora','Administrador'],['ventas@andes.bo','Víctor Ventas','Agente de Ventas'],
    ['operador@andes.bo','Olga Operadora','Operador'],['auditor@andes.bo','Aldo Auditor','Auditor']])
    await sql`insert into usuarios(email,nombre,hash,rol_id) select ${email},${nombre},${h},id from roles where nombre=${rol} on conflict (email) do nothing`;
  return NextResponse.json({ ok: true, aviso: 'Elimina SETUP_KEY de Vercel ahora.' });
}
