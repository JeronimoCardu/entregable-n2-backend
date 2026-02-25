# Entrega 1 - Backend

API de autenticación con Node.js, Express, MongoDB, Passport JWT y JWT.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- Passport (`passport-jwt`)
- `jsonwebtoken`
- `bcrypt`

## Instalación

```bash
npm install
```

## Variables de entorno

Crear archivo `.env` en la raíz:


## Ejecutar

```bash
node server.js
```

## Endpoints

Base: `/api/sessions`

## Flujo rápido

1. `POST /register`
2. `POST /login` y copiar `token`
3. `GET /current` con `Authorization: Bearer <token>`
4. `POST /logout` con el mismo token

## Notas

- La protección de rutas usa `passport.authenticate("jwt", { session: false })`.
