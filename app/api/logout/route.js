import { NextResponse } from 'next/server';
import { session, log, ipOf } from '@/lib/auth';
export async function POST(req) {
  const s = await session(req); if (s) await log(s.sub, 'LOGOUT', 'EXITOSO', ipOf(req.headers));
  const res = NextResponse.json({ ok: true }); res.cookies.set('token', '', { path: '/', maxAge: 0 }); return res;
}
