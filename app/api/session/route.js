import { NextResponse } from 'next/server';
import { session } from '@/lib/auth';
export async function GET(req) {
  const s = await session(req);
  return s ? NextResponse.json({ nombre: s.nombre, rol: s.rol, permisos: s.permisos }) : NextResponse.json({ error: 'No autenticado' }, { status: 401 });
}
