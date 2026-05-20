/**
 * CAPA DE DATOS (Repository) — PostgreSQL
 * ----------------------------------------
 * Todas las funciones son ASYNC porque las consultas a la BD
 * son operaciones de I/O que tardan tiempo (no son instantáneas).
 *
 * Usamos async/await en lugar de callbacks para que el código
 * sea más legible y fácil de mantener.
 *
 * pool.query(sql, [params]) → ejecuta una consulta y devuelve:
 *   result.rows    → array con las filas retornadas
 *   result.rowCount → número de filas afectadas (útil en DELETE/UPDATE)
 *
 * IMPORTANTE: Usamos parámetros posicionales ($1, $2, ...)
 * en lugar de concatenar strings. Esto previene inyección SQL.
 * MAL:  `WHERE id = ${id}`           ← vulnerable
 * BIEN: `WHERE id = $1` con [id]     ← seguro
 */

const pool = require("../BD/connection");

/**
 * Retorna todos los productos ordenados por ID
 * @returns {Promise<Array>} Lista de productos
 */
const findAll = async () => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY id ASC"
  );
  return result.rows; // Array de objetos: [{ id, name, category, price, stock }, ...]
};

/**
 * Busca un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object|null>} Producto encontrado o null
 */
const findById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1", // $1 es el primer parámetro (seguro)
    [id]
  );

  // result.rows[0] es el primer (y único) resultado, o undefined si no existe
  return result.rows[0] || null;
};

/**
 * Crea un nuevo producto en la base de datos
 * @param {Object} productData - { name, category, price, stock }
 * @returns {Promise<Object>} El producto recién creado con su ID asignado por Postgres
 */
const create = async (productData) => {
  const { name, category, price, stock } = productData;

  const result = await pool.query(
    // RETURNING * hace que Postgres devuelva la fila insertada completa (con el ID generado)
    `INSERT INTO products (name, category, price, stock)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, price, stock]
  );

  return result.rows[0]; // Retorna el producto con el ID que asignó Postgres
};

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto a actualizar
 * @param {Object} productData - { name, category, price, stock }
 * @returns {Promise<Object|null>} Producto actualizado o null si no existía
 */
const update = async (id, productData) => {
  const { name, category, price, stock } = productData;

  const result = await pool.query(
    `UPDATE products
     SET name = $1, category = $2, price = $3, stock = $4
     WHERE id = $5
     RETURNING *`,  // Retorna la fila actualizada
    [name, category, price, stock, id]
  );

  // Si rowCount es 0, significa que no existe un producto con ese ID
  return result.rows[0] || null;
};

/**
 * Elimina un producto por ID
 * @param {number} id - ID del producto a eliminar
 * @returns {Promise<boolean>} true si se eliminó, false si no existía
 */
const remove = async (id) => {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1",
    [id]
  );

  // rowCount indica cuántas filas fueron afectadas por el DELETE
  return result.rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
