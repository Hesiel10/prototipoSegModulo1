'use client';
import { useState } from 'react';
export default function Login() {
  const [email, setE] = useState(''), [password, setP] = useState(''), [err, setErr] = useState(''), [busy, setB] = useState(false);
  async function go(ev) {
    ev.preventDefault(); setErr(''); setB(true);
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const d = await r.json(); setB(false);
    if (r.ok) location.href = '/dashboard'; else setErr(d.error);
  }
  return (
    <div className="login">
      <section className="hero"><h1>Andes World Travel</h1><p>Panel interno. Cada acceso queda registrado y cada rol ve solo lo que le corresponde.</p></section>
      <section className="panel">
        <form onSubmit={go}>
          <h2>Iniciar sesión</h2>
          <label>Correo<input type="email" value={email} onChange={e => setE(e.target.value)} required autoComplete="username" /></label>
          <label>Contraseña<input type="password" value={password} onChange={e => setP(e.target.value)} required autoComplete="current-password" /></label>
          {err && <div className="err" role="alert">{err}</div>}
          <button disabled={busy}>{busy ? 'Verificando…' : 'Entrar'}</button>
        </form>
      </section>
    </div>
  );
}
