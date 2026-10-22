import { MODS } from '@/lib/perms';
export default function M({ params }) {
  const m = MODS[params.slug];
  return <main className="c"><a href="/dashboard">← Volver</a><h1>{m ? m.t : 'Módulo'}</h1>
    <p>Este módulo pertenece a otro integrante. Si ves esta pantalla, el control de acceso por rol te dejó pasar.</p></main>;
}
