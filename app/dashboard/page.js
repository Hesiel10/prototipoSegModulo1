'use client';
import { useEffect, useState } from 'react';
import { MODS } from '@/lib/perms';
export default function Dash() {
  const [s, setS] = useState(null);
  useEffect(() => { fetch('/api/session').then(r => r.ok ? r.json() : (location.href = '/')).then(setS); }, []);
  async function out() { await fetch('/api/logout', { method: 'POST' }); location.href = '/'; }
  if (!s) return <p style={{ padding: 32 }}>Cargando…</p>;
  return (<>
    <div className="top"><b>Andes World Travel</b><span>{s.nombre} · {s.rol} <button className="ghost" style={{ color: '#fff', borderColor: '#fff', marginLeft: 12 }} onClick={out}>Cerrar sesión</button></span></div>
    <main className="c">
      <h1>Módulos disponibles para tu rol</h1>
      <p>Los módulos con borde punteado no están permitidos para {s.rol}. Pruébalos: el sistema bloquea el acceso y lo registra.</p>
      <div className="grid">{Object.entries(MODS).map(([k, m]) => {
        const on = s.permisos.includes(m.perm);
        return <a key={k} href={m.href} className={'mod' + (on ? '' : ' off')}><small>{m.cu}</small><h2>{m.t}</h2><small>{on ? 'Acceso permitido' : 'Sin permiso'}</small></a>;
      })}</div>
    </main></>);
}
