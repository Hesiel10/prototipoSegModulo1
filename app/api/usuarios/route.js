import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { session, log, ipOf } from '@/lib/auth';
const guard = async (req) => { const s = await session(req); return s?.permisos?.includes('usuarios:gestionar') ? s : null; };
const no = () => NextResponse.json({ error: 'Sin permiso' }, { status: 403 });
export async function GET(req) {
  if (!(await guard(req))) return no();
  const rows = await sql`select u.id,u.email,u.nombre,r.nombre rol,u.activo from usuarios u join roles r on r.id=u.rol_id order by u.id`;
  const roles = await sql`select id,nombre from roles order by id`;
  return NextResponse.json({ rows, roles });
}
export async function POST(req) {
  const s = await guard(req); if (!s) return no();
  const { email, nombre, password, rol_id } = await req.json().catch(() => ({}));
  if (!/^\S+@\S+\.\S+$/.test(email || '') || !nombre || (password || '').length < 10 || !rol_id)
    return NextResponse.json({ error: 'Revisa los campos. La contraseña necesita 10 caracteres o más.' }, { status: 400 });
  const hash = await bcrypt.hash(password, 12);
  try { await sql`insert into usuarios(email,nombre,hash,rol_id) values(${email},${nombre},${hash},${rol_id})`; }
  catch { return NextResponse.json({ error: 'Ese correo ya existe' }, { status: 409 }); }
  await log(s.sub, 'CREAR_USUARIO', 'EXITOSO', ipOf(req.headers), email);
  return NextResponse.json({ ok: true });
}
export async function PATCH(req) {
  const s = await guard(req); if (!s) return no();
  const { id } = await req.json().catch(() => ({}));
  if (id === s.uid) return NextResponse.json({ error: 'No puedes desactivar tu propia cuenta' }, { status: 400 });
  await sql`update usuarios set activo = not activo where id=${id}`;
  await log(s.sub, 'CAMBIAR_ESTADO_USUARIO', 'EXITOSO', ipOf(req.headers), 'id ' + id);
  return NextResponse.json({ ok: true });
}
