/**
 * CAPA DE RUTAS (Routes)
 * -----------------------
 * Define los endpoints de la API y qué controller maneja cada uno.
 * El router de Express agrupa rutas relacionadas.
 *
 * Tabla de endpoints:
 * GET    /api/products        → getAllProducts   (listar todos)
 * GET    /api/products/:id    → getProductById   (obtener uno)
 * POST   /api/products        → createProduct    (crear nuevo)
 * PUT    /api/products/:id    → updateProduct    (actualizar)
 * DELETE /api/products/:id    → deleteProduct    (eliminar)
 */

const express = require("express");
const router = express.Router(); // Mini-aplicación Express para agrupar rutas

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Rutas sin parámetro (actúan sobre la colección completa)
router.get("/", getAllProducts);
router.post("/", createProduct);

// Rutas con parámetro :id (actúan sobre un recurso específico)
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
