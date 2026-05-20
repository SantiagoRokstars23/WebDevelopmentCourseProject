-- =====================================================
-- SCHEMA - Base de datos del proyecto CRUD
-- =====================================================
-- Instrucciones para ejecutar este archivo:
--   1. Abre pgAdmin o tu terminal de PostgreSQL
--   2. Conéctate a tu servidor PostgreSQL
--   3. Crea la base de datos (si no existe):
--        CREATE DATABASE crud_db;
--   4. Selecciona la base de datos y ejecuta este archivo
--
-- Desde terminal:
--   psql -U postgres -d crud_db -f schema.sql
-- =====================================================


-- Elimina la tabla si ya existe (útil para reiniciar)
-- PRECAUCIÓN: esto borra todos los datos existentes
DROP TABLE IF EXISTS products;


-- Crea la tabla de productos
CREATE TABLE products (
  id         SERIAL        PRIMARY KEY,         -- Auto-incremental, clave primaria
  name       VARCHAR(255)  NOT NULL,            -- Nombre del producto (requerido)
  category   VARCHAR(100)  NOT NULL,            -- Categoría (requerido)
  price      DECIMAL(10,2) NOT NULL CHECK (price >= 0),   -- Precio con 2 decimales, no negativo
  stock      INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0), -- Stock entero, no negativo
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP       -- Fecha de creación automática
);


-- Inserta datos de ejemplo para tener algo al iniciar
INSERT INTO products (name, category, price, stock) VALUES
  ('Laptop Pro 15',      'Electrónica',  1299.99, 15),
  ('Teclado Mecánico',   'Periféricos',    89.99, 42),
  ('Monitor 27"',        'Electrónica',   349.99,  8),
  ('Mouse Inalámbrico',  'Periféricos',    45.00, 60),
  ('Webcam HD 1080p',    'Periféricos',    75.00, 25),
  ('SSD 1TB NVMe',       'Almacenamiento', 99.99, 30);


-- Verifica que los datos se insertaron correctamente
SELECT * FROM products;
