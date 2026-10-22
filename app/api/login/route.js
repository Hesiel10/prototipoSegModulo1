import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sign, log, ipOf } from '@/lib/auth';
export async function POST(req) {
  const ip = ipOf(req.headers);
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || typeof password !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  const [u] = await sql`select u.*, r.nombre rol from usuarios u join roles r on r.id=u.rol_id where lower(u.email)=lower(${email})`;
  if (u?.bloqueado_hasta && new Date(u.bloqueado_hasta) > new Date()) {
    await log(email, 'LOGIN', 'BLOQUEADO', ip);
    return NextResponse.json({ error: 'Cuenta bloqueada temporalmente. Intenta en 15 minutos.' }, { status: 423 });
  }
  const ok = u && u.activo && (await bcrypt.compare(password, u.hash));
  if (!ok) {
    if (u) await sql`update usuarios set intentos = case when intentos+1>=5 then 0 else intentos+1 end,
      bloqueado_hasta = case when intentos+1>=5 then now()+interval '15 minutes' else bloqueado_hasta end where id=${u.id}`;
    await log(email, 'LOGIN', 'FALLIDO', ip);
    return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
  }
  await sql`update usuarios set intentos=0, bloqueado_hasta=null where id=${u.id}`;
  const permisos = (await sql`select p.codigo from roles_permisos rp join permisos p on p.id=rp.permiso_id where rp.rol_id=${u.rol_id}`).map(r => r.codigo);
  const token = await sign({ sub: u.email, uid: u.id, nombre: u.nombre, rol: u.rol, permisos });
  await log(u.email, 'LOGIN', 'EXITOSO', ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 900 });
  return res;
}
