# Agenda ADSO

Agenda de contactos con React, API Node.js/Express en `backend/`, autenticacion JWT y base de datos SQLite.

## Ejecutar en desarrollo

1. Copia `.env.example` como `.env` y cambia `JWT_SECRET`.
2. En una terminal ejecuta `npm run server:dev`.
3. En otra terminal ejecuta `npm run dev`.
4. Abre la URL mostrada por Vite.

La base de datos se crea automaticamente en `data/agenda.db`. Cada usuario solo puede consultar y modificar sus contactos. El rol `admin` puede consultar todos los contactos y usuarios.

## API principal

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/contacts`
- `PUT/DELETE /api/contacts/:id`
- `GET /api/users` para administradores.

## Validacion

- `npm run build` comprueba el frontend.
- `npm run server` inicia la API.
- `GET /api/health` comprueba que la API este disponible.
