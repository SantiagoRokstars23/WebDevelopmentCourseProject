/**
 * CAPA DE CONTROLADORES (Controller) — async/await
 * --------------------------------------------------
 * Ahora que el repository es async (consultas a PostgreSQL),
 * todos los controllers también deben ser async y usar try/catch
 * para manejar posibles errores de base de datos.
 *
 * Flujo de cada controller:
 *   1. Valida los datos del request
 *   2. Llama al repository con await (espera la respuesta de la BD)
 *   3. Devuelve la respuesta JSON al cliente
 *   4. Si algo falla, el catch captura el error y retorna 500
 */

const repository = require("../data/productRepository");

/**
 * GET /api/products
 * Retorna todos los productos
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await repository.findAll();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error en getAllProducts:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
    });
  }
};

/**
 * GET /api/products/:id
 * Retorna un solo producto por su ID
 */
const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await repository.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error en getProductById:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
    });
  }
};

/**
 * POST /api/products
 * Crea un nuevo producto
 */
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validación básica: todos los campos son requeridos
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos: name, category, price, stock",
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser un número positivo",
      });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "El stock debe ser un número positivo",
      });
    }

    const newProduct = await repository.create({ name, category, price, stock });

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error en createProduct:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
    });
  }
};

/**
 * PUT /api/products/:id
 * Actualiza un producto existente
 */
const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, price, stock } = req.body;

    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos: name, category, price, stock",
      });
    }

    const updatedProduct = await repository.update(id, { name, category, price, stock });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error en updateProduct:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
    });
  }
};

/**
 * DELETE /api/products/:id
 * Elimina un producto por ID
 */
const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await repository.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Producto con ID ${id} eliminado exitosamente`,
    });
  } catch (error) {
    console.error("Error en deleteProduct:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
