/**
 * CONEXIÓN A POSTGRESQL
 * ----------------------
 * Usa el módulo 'pg' (node-postgres) con un Pool de conexiones.
 *
 * ¿Por qué Pool y no Client?
 * - Client: abre y cierra UNA conexión manualmente.
 * - Pool: mantiene múltiples conexiones abiertas y las reutiliza.
 *   Es más eficiente cuando la app recibe muchas peticiones simultáneas.
 *
 * Las credenciales se leen desde variables de entorno (.env)
 * para NO escribir contraseñas en el código fuente.
 */

const { Pool } = require("pg");
require("dotenv").config(); // Carga las variables del archivo .env

// Crea el pool con la configuración de la base de datos
const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost", // Servidor de PostgreSQL
  port:     process.env.DB_PORT     || 5432,        // Puerto por defecto de PostgreSQL
  database: process.env.DB_NAME     || "crud_db",   // Nombre de la base de datos
  user:     process.env.DB_USER     || "postgres",  // Usuario de PostgreSQL
  password: process.env.DB_PASSWORD || "",          // Contraseña del usuario
});

/**
 * Evento que se dispara cada vez que el Pool crea una nueva conexión.
 * Útil para confirmar que la conexión está activa al iniciar.
 */
pool.on("connect", () => {
  console.log(" Conexión a PostgreSQL establecida");
});

/**
 * Evento que captura errores inesperados en conexiones inactivas del Pool.
 * Previene que la app se caiga por un error silencioso de BD.
 */
pool.on("error", (err) => {
  console.error(" Error inesperado en el pool de PostgreSQL:", err.message);
  process.exit(1); // Termina el proceso si la BD falla completamente
});

// Exporta el pool para usarlo en el repository
module.exports = pool;
