CREATE DATABASE db_softvet;
USE db_softvet;

CREATE TABLE roles (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE empleados (
  id_empleado INT PRIMARY KEY AUTO_INCREMENT,
  usuario VARCHAR(100) UNIQUE,
  contrasena VARCHAR(255),
  nombre_empleado VARCHAR(100),
  dni_empleado VARCHAR(100) UNIQUE,
  direccion_empleado VARCHAR(100),
  telefono_empleado VARCHAR(100),
  mail_empleado VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  id_rol INT,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  nombre_cliente VARCHAR(100),
  dni_cliente VARCHAR(100) UNIQUE,
  direccion_cliente VARCHAR(100),
  celular_cliente VARCHAR(100),
  mail_cliente VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE especies (
  id_especie INT PRIMARY KEY AUTO_INCREMENT,
  nombre_especie VARCHAR(100) UNIQUE
);

CREATE TABLE razas (
  id_raza INT PRIMARY KEY AUTO_INCREMENT,
  nombre_raza VARCHAR(100) UNIQUE,
  id_especie INT,
  FOREIGN KEY (id_especie) REFERENCES especies(id_especie) ON DELETE CASCADE
);

CREATE TABLE sucursales (
  id_sucursal INT PRIMARY KEY AUTO_INCREMENT,
  nombre_sucursal VARCHAR(100),
  direccion_sucursal VARCHAR(100),
  celular_sucursal VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE historia_clinica (
  id_historia_clinica INT PRIMARY KEY AUTO_INCREMENT,
  fecha_apertura DATETIME,
  observaciones_generales VARCHAR(100)
);

CREATE TABLE ventas (
  id_venta INT PRIMARY KEY AUTO_INCREMENT,
  fecha_hora DATETIME,
  total VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  id_cliente INT,
  id_empleado INT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE
);

CREATE TABLE detalle_historia_clinica (
  id_detalle_historia_clinica INT PRIMARY KEY AUTO_INCREMENT,
  observaciones TEXT,
  fecha_hora DATETIME,
  id_empleado INT,
  id_historia_clinica INT,
  id_sucursal INT,
  id_venta INT,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE,
  FOREIGN KEY (id_historia_clinica) REFERENCES historia_clinica(id_historia_clinica) ON DELETE CASCADE,
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal) ON DELETE CASCADE,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE
);

CREATE TABLE mascotas (
  id_mascota INT PRIMARY KEY AUTO_INCREMENT,
  nombre_mascota VARCHAR(100),
  edad_mascota VARCHAR(3),
  sexo_mascota VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  id_raza INT,
  id_cliente INT,
  id_historia_clinica INT,
  FOREIGN KEY (id_raza) REFERENCES razas(id_raza) ON DELETE CASCADE,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_historia_clinica) REFERENCES historia_clinica(id_historia_clinica) ON DELETE CASCADE
);

CREATE TABLE turnos (
  id_turno INT PRIMARY KEY AUTO_INCREMENT,
  fecha_hora DATETIME,
  motivo_turno VARCHAR(100),
  estado VARCHAR(50),
  id_cliente INT,
  id_mascota INT,
  id_empleado INT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota) ON DELETE CASCADE,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE
);

CREATE TABLE categorias (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  nombre_categoria VARCHAR(100) UNIQUE
);

CREATE TABLE productos (
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  nombre_producto VARCHAR(100),
  codigo_producto VARCHAR(100) UNIQUE,
  precio_producto VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

CREATE TABLE stock (
  id_stock INT PRIMARY KEY AUTO_INCREMENT,
  cantidad INT,
  fecha_ingreso DATETIME,
  observaciones_stock VARCHAR(100),
  id_producto INT,
  id_sucursal INT,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal) ON DELETE CASCADE
);

CREATE TABLE proveedores (
  id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
  nombre_proveedor VARCHAR(100),
  direccion_proveedor VARCHAR(100),
  celular_proveedor VARCHAR(100),
  mail_proveedor VARCHAR(100),
  fecha_hora_alta_proveedor DATETIME
);

CREATE TABLE proveedor_productos (
  id_proveedor_productos INT PRIMARY KEY AUTO_INCREMENT,
  id_proveedor INT,
  id_producto INT,
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE detalles_ventas (
  id_detalle_venta INT PRIMARY KEY AUTO_INCREMENT,
  cantidad VARCHAR(100),
  precio_unitario VARCHAR(100),
  sub_total VARCHAR(100),
  id_venta INT,
  id_producto INT,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE compras (
  id_compra INT PRIMARY KEY AUTO_INCREMENT,
  total VARCHAR(100),
  fecha_hora DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  id_empleado INT,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

CREATE TABLE detalles_compras (
  id_detalle_compra INT PRIMARY KEY AUTO_INCREMENT,
  cantidad VARCHAR(100),
  precio_unitario VARCHAR(100),
  sub_total VARCHAR(100),
  id_producto INT,
  id_compra INT,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  FOREIGN KEY (id_compra) REFERENCES compras(id_compra)
);
