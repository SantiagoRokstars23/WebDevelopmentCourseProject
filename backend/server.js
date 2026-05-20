/**
 * SERVIDOR PRINCIPAL (Entry Point)
 * ----------------------------------
 * Este es el archivo de entrada del backend.
 * Configura Express, los middlewares globales y registra las rutas.
 *
 * Middlewares usados:
 * - cors: Permite que el frontend (otro origen) consuma la API
 * - express.json(): Parsea el cuerpo de las requests como JSON automáticamente
 */

require("dotenv").config(); // Debe ser lo primero — carga el .env antes que todo

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

// Inicializa la aplicación Express
const app = express();

// Puerto donde escuchará el servidor (usa variable de entorno o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================

// Permite peticiones desde cualquier origen (útil en desarrollo)
// En producción, reemplaza el "*" por la URL exacta del frontend
app.use(cors());

// Permite recibir y parsear JSON en el body de las requests (POST, PUT)
app.use(express.json());

// ==========================================
// RUTAS
// ==========================================

// Todas las rutas de productos estarán bajo el prefijo /api/products
// Ejemplo: GET /api/products, POST /api/products, etc.
app.use("/api/products", productRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "API CRUD funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
    },
  });
});

// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
  });
});

// ==========================================
// MANEJO GLOBAL DE ERRORES (500)
// ==========================================
// Este middleware se ejecuta cuando se llama next(error) en cualquier route
app.use((err, req, res, next) => {
  console.error("Error interno:", err.message);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

// ==========================================
// INICIA EL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en: http://localhost:${PORT}`);
  console.log(` API de productos:      http://localhost:${PORT}/api/products`);
  console.log(` Modo:                  ${process.env.NODE_ENV || "development"}\n`);
});
