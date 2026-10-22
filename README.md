# Prototipo Módulo 1: Ciberseguridad y RBAC (Andes World Travel)
Next.js + Neon (PostgreSQL) + JWT + bcrypt. Cubre CU01, CU02 y CU03.

## Puesta en marcha
1. Crea un proyecto gratis en neon.tech y ejecuta `schema.sql` en su SQL Editor.
2. Sube esta carpeta a GitHub e impórtala en Vercel.
3. En Vercel > Settings > Environment Variables agrega `DATABASE_URL`, `JWT_SECRET` y `SETUP_KEY` (ver `.env.example`).
4. Despliega y abre una vez `https://TU-APP.vercel.app/api/setup?key=TU_SETUP_KEY` para crear los usuarios demo.
5. Borra `SETUP_KEY` de Vercel.

Usuarios demo (contraseña `Andes2026!`): admin@, ventas@, operador@, auditor@ + `andes.bo`.

## Guion de demo
1. Entra como operador: ve solo Reservas y Proveedores. Abre Usuarios: acceso denegado.
2. Falla la contraseña 5 veces: la cuenta se bloquea 15 min.
3. Entra como admin y crea un usuario o desactiva a otro.
4. Entra como auditor y revisa la bitácora (logins, bloqueos, denegaciones).
