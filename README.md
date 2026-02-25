# Entrega 1 - Jeronimo Cardu

API backend en Node.js/Express para registro, login y autenticación de usuario usando Passport con estrategia `passport-jwt`.

## Estado actual del proyecto

- Ruta base disponible: `/api/sessions`.
- Autenticación protegida mediante token JWT enviado en header `Authorization: Bearer <token>`.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Passport (`passport-jwt`)
- Bcrypt
- Dotenv

## Estructura

config/
db.js
passport.config.js
middlewares/
auth.js
models/
User.js
Cart.js
Product.js
routes/
sessions.routes.js
server.js
package.json

````


## Instalación

```bash
npm install
````

## Ejecución

Modo normal:

```bash
node server.js
```

## Flujo de autenticación

1. Registrar usuario en `POST /api/sessions/register`.
2. Loguear usuario en `POST /api/sessions/login`.
3. Copiar el `token` recibido.
4. Enviar el token en `Authorization: Bearer <token>` para consumir rutas protegidas.

## Endpoints

### 1) Registrar usuario

**POST** `/api/sessions/register`

### 2) Login

**POST** `/api/sessions/login`

### 3) Current (ruta protegida)

**GET** `/api/sessions/current`

### 4) Logout

**POST** `/api/sessions/logout`

## Modelos de datos

### User

- `first_name` (String, requerido)
- `last_name` (String, requerido)
- `email` (String, requerido, único)
- `age` (Number, requerido)
- `password` (String, requerido, hasheado)
- `cart` (ObjectId -> `Cart`)
- `role` (`user | admin`, default `user`)

### Cart

- `products[]`
  - `product` (ObjectId -> `Product`, requerido)
  - `quantity` (Number, requerido, min 1, default 1)

### Product

- `title` (String, requerido)
- `description` (String, requerido)
- `code` (String, requerido, único)
- `price` (Number, requerido, min 0)
- `status` (Boolean, default `true`)
- `stock` (Number, requerido, min 0)
- `category` (String, requerido)
- `thumbnails` (String[], default `[]`)

## Notas importantes

- La autenticación de rutas protegidas (`/current` y `/logout`) usa `passport.authenticate("jwt")`.
- `register` y `login` no usan `passport-local`; se resuelven con lógica de negocio directa y hash de contraseñas con `bcrypt`.
- `logout` en JWT stateless confirma cierre de sesión a nivel API, pero no invalida un token emitido previamente; para invalidación real se requiere blacklist/rotación.
- El script `npm test` no tiene tests implementados aún.

## Pruebas rápidas con cURL

Registro:

```bash
curl -X POST http://localhost:3000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jero","last_name":"Cardu","age":22,"email":"jero@mail.com","password":"123456"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jero@mail.com","password":"123456"}'
```

Current (reemplazar TOKEN):

```bash
curl http://localhost:3000/api/sessions/current \
  -H "Authorization: Bearer TOKEN"
```

## Autor

- Jeronimo Cardu
