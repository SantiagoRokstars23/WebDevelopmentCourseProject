# CRUD Admin Panel — Node.js + PostgreSQL + Vanilla JS

Admin panel fullstack para gestión de productos. API REST con Express y frontend con HTML/CSS/JS puro.

---

## Estructura del proyecto

```
├── backend/
│   ├── BD/
│   │   ├── connection.js       # Conexión a PostgreSQL (Pool)
│   │   └── schema.sql          # Creación de tabla e inserción de datos
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── productRepository.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── .env.example            # Plantilla de variables de entorno
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── app.js
    └── index.html
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior
- Un cliente de BD: [DBeaver](https://dbeaver.io/), pgAdmin o psql

---

## 1. Configurar la base de datos

### Opción A — DBeaver / pgAdmin (recomendado)

1. Abre DBeaver y conéctate a tu servidor PostgreSQL
2. Click derecho en **Databases** → **Create** → **Database**
3. Nombre: `crud_db` → **OK**
4. Click derecho en `crud_db` → **SQL Editor** → **Open SQL Script**
5. Abre el archivo `backend/BD/schema.sql`
6. Ejecuta con **Alt + X** o el botón ▶

### Opción B — psql (terminal)

```bash
psql -U postgres -c "CREATE DATABASE crud_db;"
psql -U postgres -d crud_db -f backend/BD/schema.sql
```

---

## 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus credenciales de PostgreSQL:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=crud_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

---

## 3. Instalar dependencias e iniciar el backend

```bash
cd backend
npm install
npm run dev
```

Si la conexión es exitosa verás:

```
 Conexión a PostgreSQL establecida
 Servidor corriendo en: http://localhost:3000
 API de productos:      http://localhost:3000/api/products
```

---

## 4. Abrir el frontend

Abre el archivo `frontend/index.html` directamente en tu navegador.

> Si usas VS Code, instala la extensión **Live Server** y haz click en **Go Live** para evitar problemas de CORS en algunas configuraciones.

---

## Endpoints de la API

| Método | Endpoint               | Descripción         |
|--------|------------------------|---------------------|
| GET    | `/api/products`        | Listar todos        |
| GET    | `/api/products/:id`    | Obtener uno por ID  |
| POST   | `/api/products`        | Crear nuevo         |
| PUT    | `/api/products/:id`    | Actualizar          |
| DELETE | `/api/products/:id`    | Eliminar            |

### Ejemplo de body para POST / PUT

```json
{
  "name": "Laptop Pro 15",
  "category": "Electrónica",
  "price": 1299.99,
  "stock": 15
}
```

---

## Probar la API con el navegador o herramienta REST

Puedes probar los endpoints con [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/) (extensión de VS Code):

```
GET    http://localhost:3000/api/products
POST   http://localhost:3000/api/products
PUT    http://localhost:3000/api/products/1
DELETE http://localhost:3000/api/products/1
```

---

## Ejecutar con Docker

La forma más rápida de levantar todo el proyecto sin instalar Node.js ni PostgreSQL manualmente.

### Requisito

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

### Iniciar todos los servicios

```bash
docker compose up -d
```

Esto levanta automáticamente:
- **PostgreSQL** en el puerto `5432` (crea la tabla y datos de ejemplo al iniciar)
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:80`

### Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Detener todos los contenedores (los datos se conservan)
docker compose down

# Detener y borrar la base de datos (reset completo)
docker compose down -v

# Reconstruir las imágenes después de cambiar código
docker compose up -d --build
```

### Servicios y puertos

| Servicio   | URL                          | Puerto |
|------------|------------------------------|--------|
| Frontend   | http://localhost             | 80     |
| Backend    | http://localhost:3000        | 3000   |
| PostgreSQL | localhost:5432               | 5432   |

> Los datos de PostgreSQL persisten en un volumen Docker (`postgres_data`).
> Solo se pierden al ejecutar `docker compose down -v`.

---

## Stack tecnológico

| Capa           | Tecnología                  |
|----------------|-----------------------------|
| Backend        | Node.js + Express           |
| Base de datos  | PostgreSQL + pg (Pool)      |
| Frontend       | HTML + CSS + JavaScript     |
| Contenedores   | Docker + Docker Compose     |
| Dev tool       | nodemon                     |
