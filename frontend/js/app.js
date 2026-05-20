/**
 * FRONTEND - Lógica principal del Admin Panel
 * ============================================
 * Este archivo maneja:
 * 1. Comunicación con la API REST usando fetch
 * 2. Renderizado dinámico de la tabla
 * 3. Modal de creación/edición
 * 4. Búsqueda en tiempo real
 * 5. Notificaciones toast
 * 6. Actualización de estadísticas
 */

// ============================================
// CONFIGURACIÓN
// ============================================

// URL base de la API. Cámbiala si el backend corre en otro puerto
const API_URL = "http://localhost:3000/api/products";

// ============================================
// REFERENCIAS AL DOM
// Guardamos las referencias una vez para no buscarlas en cada render
// ============================================
const tableBody      = document.getElementById("tableBody");
const tableWrapper   = document.getElementById("tableWrapper");
const loading        = document.getElementById("loading");
const emptyState     = document.getElementById("emptyState");
const searchInput    = document.getElementById("searchInput");

const modalOverlay   = document.getElementById("modalOverlay");
const modalTitle     = document.getElementById("modalTitle");
const productForm    = document.getElementById("productForm");
const productId      = document.getElementById("productId");
const productName    = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice   = document.getElementById("productPrice");
const productStock   = document.getElementById("productStock");

const btnOpenModal   = document.getElementById("btnOpenModal");
const btnOpenModalEmpty = document.getElementById("btnOpenModalEmpty");
const btnCloseModal  = document.getElementById("btnCloseModal");
const btnCancel      = document.getElementById("btnCancel");

const toast          = document.getElementById("toast");
const toastIcon      = document.getElementById("toastIcon");
const toastMessage   = document.getElementById("toastMessage");

// Estadísticas
const statTotal      = document.getElementById("statTotal");
const statInStock    = document.getElementById("statInStock");
const statLowStock   = document.getElementById("statLowStock");
const statCategories = document.getElementById("statCategories");

// ============================================
// ESTADO DE LA APLICACIÓN
// Guarda todos los productos para la búsqueda local
// ============================================
let allProducts = []; // Array con todos los productos cargados

// ============================================
// FUNCIONES DE API (fetch hacia el backend)
// ============================================

/**
 * Obtiene todos los productos desde la API
 * @returns {Promise<Array>} Lista de productos
 */
const fetchProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Error al cargar productos: ${response.status}`);
  }

  const result = await response.json();
  return result.data; // La API devuelve { success, count, data: [...] }
};

/**
 * Crea un nuevo producto en la API
 * @param {Object} productData - Datos del producto a crear
 * @returns {Promise<Object>} Producto creado
 */
const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Le dice al backend que enviamos JSON
    },
    body: JSON.stringify(productData),    // Convierte el objeto a string JSON
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al crear producto");
  }

  return result.data;
};

/**
 * Actualiza un producto existente en la API
 * @param {number} id - ID del producto a actualizar
 * @param {Object} productData - Nuevos datos
 * @returns {Promise<Object>} Producto actualizado
 */
const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al actualizar producto");
  }

  return result.data;
};

/**
 * Elimina un producto de la API
 * @param {number} id - ID del producto a eliminar
 */
const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al eliminar producto");
  }
};

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================

/**
 * Renderiza todos los productos en la tabla
 * @param {Array} products - Lista de productos a mostrar
 */
const renderTable = (products) => {
  // Limpia las filas anteriores
  tableBody.innerHTML = "";

  if (products.length === 0) {
    // Muestra el estado vacío y oculta la tabla
    tableWrapper.style.display = "none";
    emptyState.style.display   = "flex";
    return;
  }

  // Muestra la tabla y oculta el estado vacío
  tableWrapper.style.display = "block";
  emptyState.style.display   = "none";

  // Genera una fila HTML por cada producto
  products.forEach((product) => {
    const row = document.createElement("tr");

    // Determina el badge de stock (verde si > 10, rojo si <= 10)
    const stockClass   = product.stock > 10 ? "stock-badge--ok" : "stock-badge--low";
    const stockLabel   = product.stock > 10 ? "Disponible" : "Stock Bajo";

    row.innerHTML = `
      <td>#${product.id}</td>
      <td>${escapeHtml(product.name)}</td>
      <td>${escapeHtml(product.category)}</td>
      <td><span class="price-badge">$${Number(product.price).toFixed(2)}</span></td>
      <td>${product.stock} unid.</td>
      <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
      <td>
        <div class="table__actions">
          <button class="btn btn--edit" onclick="openEditModal(${product.id})">
            Editar
          </button>
          <button class="btn btn--danger" onclick="handleDelete(${product.id})">
            Eliminar
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
};

/**
 * Actualiza las tarjetas de estadísticas en el header
 * @param {Array} products - Lista de productos
 */
const updateStats = (products) => {
  const inStock   = products.filter((p) => p.stock > 0).length;
  const lowStock  = products.filter((p) => p.stock <= 10).length;

  // Obtiene categorías únicas usando Set
  const uniqueCategories = new Set(products.map((p) => p.category));

  statTotal.textContent      = products.length;
  statInStock.textContent    = inStock;
  statLowStock.textContent   = lowStock;
  statCategories.textContent = uniqueCategories.size;
};

// ============================================
// FLUJO PRINCIPAL - Carga de datos
// ============================================

/**
 * Carga los productos desde la API y actualiza la UI completa
 */
const loadProducts = async () => {
  // Muestra el spinner de carga
  loading.style.display      = "flex";
  tableWrapper.style.display = "none";
  emptyState.style.display   = "none";

  try {
    allProducts = await fetchProducts();
    renderTable(allProducts);
    updateStats(allProducts);
  } catch (error) {
    console.error("Error cargando productos:", error);
    showToast("Error al cargar los productos. ¿Está corriendo el backend?", "error");
    emptyState.style.display = "flex";
  } finally {
    // Siempre oculta el spinner, haya error o no
    loading.style.display = "none";
  }
};

// ============================================
// MODAL - Abrir, cerrar y poblar
// ============================================

/**
 * Limpia y abre el modal en modo "crear"
 */
const openCreateModal = () => {
  modalTitle.textContent    = "Nuevo Producto";
  productId.value           = "";       // Sin ID = modo creación
  productForm.reset();                  // Limpia todos los campos
  openModal();
};

/**
 * Busca el producto por ID y abre el modal en modo "editar"
 * @param {number} id - ID del producto a editar
 */
const openEditModal = (id) => {
  // Busca el producto en el estado local (no hace otra petición al servidor)
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    showToast("Producto no encontrado", "error");
    return;
  }

  // Cambia el título y rellena el formulario con los datos actuales
  modalTitle.textContent       = "Editar Producto";
  productId.value              = product.id;  // Guarda el ID para el PUT
  productName.value            = product.name;
  productCategory.value        = product.category;
  productPrice.value           = product.price;
  productStock.value           = product.stock;

  openModal();
};

const openModal  = () => modalOverlay.classList.add("is-open");
const closeModal = () => modalOverlay.classList.remove("is-open");

// ============================================
// MANEJADORES DE EVENTOS
// ============================================

/**
 * Maneja el submit del formulario (crear o editar según si hay ID)
 */
productForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita que el formulario recargue la página

  // Recopila los datos del formulario
  const formData = {
    name:     productName.value.trim(),
    category: productCategory.value.trim(),
    price:    parseFloat(productPrice.value),
    stock:    parseInt(productStock.value),
  };

  const id = productId.value; // Vacío = crear, con valor = editar

  try {
    if (id) {
      // MODO EDICIÓN: hace PUT con el ID
      await updateProduct(parseInt(id), formData);
      showToast("Producto actualizado exitosamente", "success");
    } else {
      // MODO CREACIÓN: hace POST
      await createProduct(formData);
      showToast("Producto creado exitosamente", "success");
    }

    closeModal();
    await loadProducts(); // Recarga la lista para ver los cambios
  } catch (error) {
    console.error("Error guardando producto:", error);
    showToast(error.message, "error");
  }
});

/**
 * Maneja la eliminación de un producto con confirmación
 * @param {number} id - ID del producto a eliminar
 */
const handleDelete = async (id) => {
  // Pide confirmación antes de eliminar (acción irreversible)
  const confirmed = confirm("¿Estás seguro de que deseas eliminar este producto?\nEsta acción no se puede deshacer.");

  if (!confirmed) return;

  try {
    await deleteProduct(id);
    showToast("Producto eliminado exitosamente", "success");
    await loadProducts(); // Recarga la lista
  } catch (error) {
    console.error("Error eliminando producto:", error);
    showToast(error.message, "error");
  }
};

/**
 * Búsqueda en tiempo real (filtra el array local sin llamar a la API)
 * Se ejecuta cada vez que el usuario escribe en el buscador
 */
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    // Si el buscador está vacío, muestra todos los productos
    renderTable(allProducts);
    return;
  }

  // Filtra los productos cuyo nombre o categoría contengan el texto buscado
  const filtered = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );

  renderTable(filtered);
});

// Botones para abrir el modal de creación
btnOpenModal.addEventListener("click", openCreateModal);
btnOpenModalEmpty.addEventListener("click", openCreateModal);

// Botones para cerrar el modal
btnCloseModal.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

// Cierra el modal al hacer click en el overlay (fuera del modal)
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

// Cierra el modal con la tecla Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// ============================================
// UTILIDADES
// ============================================

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - "success" | "error" | "info"
 */
const showToast = (message, type = "success") => {
  // Configura el ícono y el color según el tipo
  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  toastIcon.textContent    = icons[type] || icons.success;
  toastMessage.textContent = message;

  // Limpia clases anteriores y aplica la nueva
  toast.className = `toast toast--${type}`;

  // Hace visible el toast con animación
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  // Lo oculta automáticamente después de 3 segundos
  setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
};

/**
 * Escapa caracteres HTML para prevenir XSS
 * Evita que texto del usuario rompa el HTML o inyecte scripts
 * @param {string} text - Texto a escapar
 * @returns {string} Texto seguro para insertar en el DOM
 */
const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
};

// ============================================
// INICIO DE LA APLICACIÓN
// Se ejecuta cuando el script carga
// ============================================
loadProducts();
