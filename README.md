# E-Commerce Backend - Entrega Final

Proyecto final del curso de Backend II de Coderhouse. Es una aplicacion e-commerce fullstack con autenticacion JWT, gestion de productos, carrito de compras y proceso de compra con generacion de tickets.

---

## Stack tecnologico

**Backend:** Node.js, Express 5, MongoDB (Mongoose), Passport JWT, bcrypt, Nodemailer

**Frontend:** HTML, CSS, JavaScript vanilla (SPA con hash routing)

---

## Estructura del proyecto

```
back/
  server.js                 # Punto de entrada del servidor
  config/
    db.js                   # Conexion a MongoDB
    passport.config.js      # Estrategia JWT de Passport
  controllers/              # Manejo de request/response HTTP
  services/                 # Logica de negocio
  daos/
    models/                 # Schemas de Mongoose
    mongo/                  # Data Access Objects
  dtos/
    user.dto.js             # DTO para excluir password del usuario
  middlewares/
    auth.js                 # Middleware de autenticacion (Passport)
    authorization.js        # Middleware de autorizacion por roles
  routes/                   # Definicion de rutas
  utils/
    mailer.util.js          # Envio de emails con Nodemailer
    password.util.js        # Hasheo y comparacion de passwords
    token.util.js           # Generacion y verificacion de JWT

front/
  index.html                # SPA - punto de entrada
  style.css
  js/
    app.js                  # Inicializacion
    router.js               # Ruteo por hash
    state.js                # Estado global (token, user, cartId)
    api.js                  # Wrapper de fetch para las API calls
    nav.js                  # Navegacion y badge del carrito
    toast.js                # Notificaciones
    views/                  # Vistas/componentes de cada pagina
```

---

## Instalacion y ejecucion

### 1. Instalar dependencias

```bash
cd back
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` dentro de la carpeta `back/`:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db
SECRET_KEY_COOKIES=una-clave-secreta
GMAIL_USER=tu-email@gmail.com
GMAIL_PASS=tu-app-password
PORT=3000
BASE_URL=http://localhost:3000
```

Para `GMAIL_PASS` hay que usar una App Password de Google, no la contraseña normal de la cuenta.

### 3. Iniciar el servidor

```bash
npm start
```

El servidor levanta en `http://localhost:3000`. El frontend se sirve desde la carpeta `front/`.

---

## Modelos de datos

### User

| Campo      | Tipo     | Detalles                       |
| ---------- | -------- | ------------------------------ |
| first_name | String   | Requerido                      |
| last_name  | String   | Requerido                      |
| email      | String   | Requerido, unico               |
| age        | Number   | Requerido                      |
| password   | String   | Requerido, hasheado con bcrypt |
| cart       | ObjectId | Referencia a Cart              |
| role       | String   | "user" (default) o "admin"     |

### Product

| Campo       | Tipo     | Detalles         |
| ----------- | -------- | ---------------- |
| title       | String   | Requerido        |
| description | String   | Requerido        |
| code        | String   | Requerido, unico |
| price       | Number   | Requerido, min 0 |
| status      | Boolean  | Default: true    |
| stock       | Number   | Requerido, min 0 |
| category    | String   | Requerido        |
| thumbnails  | [String] | Default: []      |

### Cart

| Campo    | Tipo                                      | Detalles       |
| -------- | ----------------------------------------- | -------------- |
| products | [{ product: ObjectId, quantity: Number }] | Array de items |

### Ticket

| Campo             | Tipo   | Detalles            |
| ----------------- | ------ | ------------------- |
| code              | String | UUID unico          |
| purchase_datetime | Date   | Fecha de compra     |
| amount            | Number | Monto total         |
| purchaser         | String | Email del comprador |

---

## Endpoints de la API

### Sessions (`/api/sessions`)

| Metodo | Ruta             | Auth | Descripcion                              |
| ------ | ---------------- | ---- | ---------------------------------------- |
| POST   | /register        | No   | Registrar usuario nuevo                  |
| POST   | /login           | No   | Iniciar sesion, devuelve JWT             |
| GET    | /current         | Si   | Obtener datos del usuario logueado       |
| POST   | /logout          | Si   | Cerrar sesion                            |
| POST   | /forgot-password | No   | Enviar email de recuperacion de password |
| POST   | /reset-password  | No   | Resetear password con token del email    |

### Products (`/api/products`)

| Metodo | Ruta  | Auth | Rol   | Descripcion         |
| ------ | ----- | ---- | ----- | ------------------- |
| GET    | /     | No   | -     | Listar productos    |
| GET    | /:pid | No   | -     | Obtener producto    |
| POST   | /     | Si   | admin | Crear producto      |
| PUT    | /:pid | Si   | admin | Actualizar producto |
| DELETE | /:pid | Si   | admin | Eliminar producto   |

### Carts (`/api/carts`)

| Metodo | Ruta               | Auth | Rol  | Descripcion                        |
| ------ | ------------------ | ---- | ---- | ---------------------------------- |
| POST   | /                  | Si   | user | Crear carrito vacio                |
| GET    | /:cid              | Si   | -    | Obtener carrito con productos      |
| POST   | /:cid/product/:pid | Si   | user | Agregar producto al carrito        |
| DELETE | /:cid/product/:pid | Si   | user | Eliminar producto del carrito      |
| PUT    | /:cid/product/:pid | Si   | user | Actualizar cantidad de un producto |
| POST   | /:cid/purchase     | Si   | user | Finalizar compra                   |

---

## Autenticacion y autorizacion

- La autenticacion se maneja con **JWT** a traves de Passport.js
- El token se genera al hacer login y tiene una duracion de 1 hora
- Se envia en el header `Authorization: Bearer <token>`
- La autorizacion es por roles: `user` y `admin`
- Los usuarios normales pueden comprar, los admin pueden gestionar productos
- La proteccion de rutas usa `passport.authenticate("jwt", { session: false })`

---

## Flujo de compra

1. El usuario agrega productos al carrito
2. Al hacer checkout (`POST /:cid/purchase`), el sistema:
   - Verifica que el carrito no este vacio
   - Chequea el stock de todos los productos antes de procesar
   - Si algun producto no tiene stock suficiente, rechaza la compra con detalle
   - Descuenta el stock de cada producto
   - Calcula el monto total
   - Genera un ticket con un codigo UUID
   - Vacia el carrito

---

## Recuperacion de password

1. El usuario ingresa su email en `/forgot-password`
2. Se envia un email con un link que contiene un token JWT (1 hora de validez)
3. El usuario accede al link y define una nueva password
4. No se permite reutilizar la password anterior

---

## Patrones utilizados

- **DAO (Data Access Object):** Abstraccion de las operaciones de MongoDB en clases separadas
- **DTO (Data Transfer Object):** Se usa para filtrar campos sensibles (como el password) antes de enviar respuestas
- **Controller - Service:** Los controllers manejan HTTP, los services contienen la logica de negocio
- **SPA con hash routing:** El frontend es una single-page app que rutea con el hash de la URL

---

## Roles y permisos

| Accion             | user | admin |
| ------------------ | ---- | ----- |
| Ver productos      | Si   | Si    |
| Agregar al carrito | Si   | No    |
| Comprar            | Si   | No    |
| Crear producto     | No   | Si    |
| Editar producto    | No   | Si    |
| Eliminar producto  | No   | Si    |
| Ver perfil         | Si   | Si    |

---

## Dependencias

- express
- mongoose
- passport / passport-jwt
- jsonwebtoken
- bcrypt
- nodemailer
- cors
- dotenv
