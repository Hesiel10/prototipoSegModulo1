'use client';
import { useEffect, useState } from 'react';
export default function U() {
  const [d, setD] = useState({ rows: [], roles: [] }), [f, setF] = useState({ email: '', nombre: '', password: '', rol_id: '' }), [msg, setMsg] = useState('');
  const load = () => fetch('/api/usuarios').then(r => r.json()).then(x => x.rows && setD(x));
  useEffect(() => { load(); }, []);
  async function add(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, rol_id: +f.rol_id }) });
    const x = await r.json(); setMsg(r.ok ? 'Usuario creado' : x.error); if (r.ok) { setF({ email: '', nombre: '', password: '', rol_id: '' }); load(); }
  }
  async function toggle(id) {
    const r = await fetch('/api/usuarios', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!r.ok) setMsg((await r.json()).error); load();
  }
  return <main className="c"><a href="/dashboard">← Volver</a><h1>Usuarios y roles</h1>
    <form onSubmit={add} className="row" style={{ width: '100%' }}>
      <label>Correo<input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required /></label>
      <label>Nombre<input value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} required /></label>
      <label>Contraseña (10+)<input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} required /></label>
      <label>Rol<select value={f.rol_id} onChange={e => setF({ ...f, rol_id: e.target.value })} required><option value="">Elegir…</option>{d.roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}</select></label>
      <button>Crear usuario</button></form>
    {msg && <p role="status" className={msg === 'Usuario creado' ? 'ok' : 'err'}>{msg}</p>}
    <div className="scroll"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr></thead>
      <tbody>{d.rows.map(u => <tr key={u.id}><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td><td>{u.activo ? 'Activo' : 'Desactivado'}</td>
        <td><button className="ghost" onClick={() => toggle(u.id)}>{u.activo ? 'Desactivar' : 'Activar'}</button></td></tr>)}</tbody></table></div></main>;
}
