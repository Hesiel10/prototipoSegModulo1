'use client';
import { useEffect, useState } from 'react';
export default function B() {
  const [rows, setR] = useState([]), [f, setF] = useState('');
  useEffect(() => { fetch('/api/bitacora' + (f ? '?resultado=' + f : '')).then(r => r.json()).then(x => setR(x.rows || [])); }, [f]);
  return <main className="c"><a href="/dashboard">← Volver</a><h1>Bitácora de seguridad</h1>
    <div className="row"><label>Resultado<select value={f} onChange={e => setF(e.target.value)}><option value="">Todos</option>
      {['EXITOSO', 'FALLIDO', 'BLOQUEADO', 'DENEGADO'].map(x => <option key={x}>{x}</option>)}</select></label></div>
    <div className="scroll"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Resultado</th><th>IP</th><th>Detalle</th></tr></thead>
      <tbody>{rows.map(r => <tr key={r.id}><td>{new Date(r.fecha).toLocaleString('es-BO')}</td><td>{r.usuario}</td><td>{r.accion}</td>
        <td className={r.resultado === 'EXITOSO' ? 'ok' : 'err'}>{r.resultado}</td><td>{r.ip}</td><td>{r.detalle}</td></tr>)}</tbody></table></div>
    {!rows.length && <p>Aún no hay eventos con este filtro.</p>}</main>;
}
