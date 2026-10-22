import { cookies, headers } from 'next/headers';
import { verify, log, ipOf } from '@/lib/auth';
export default async function P({ searchParams }) {
  const t = cookies().get('token')?.value, s = t && (await verify(t));
  await log(s?.sub || 'anónimo', 'ACCESO', 'DENEGADO', ipOf(headers()), String(searchParams.ruta || '').slice(0, 120));
  return <main className="c"><h1>Acceso denegado</h1><p>Tu rol no tiene permiso para esta sección. El intento quedó registrado en la bitácora.</p><a className="btn" href="/dashboard">Volver al panel</a></main>;
}
