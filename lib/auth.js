import { SignJWT, jwtVerify } from 'jose';
import { sql } from './db';
const key = () => new TextEncoder().encode(process.env.JWT_SECRET);
export const sign = (p) => new SignJWT(p).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('15m').sign(key());
export async function verify(t) { try { return (await jwtVerify(t, key())).payload; } catch { return null; } }
export async function session(req) { const t = req.cookies.get('token')?.value; return t ? verify(t) : null; }
export const ipOf = (h) => (h.get('x-forwarded-for') || '?').split(',')[0];
export const log = (usuario, accion, resultado, ip, detalle = '') =>
  sql`insert into bitacora_seguridad(usuario,accion,resultado,ip,detalle) values(${usuario},${accion},${resultado},${ip},${detalle})`;
