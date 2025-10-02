CREATE database db_softvet;

USE db_softvet;

CREATE TABLE roles (
id_rol int primary key auto_increment,
nombre_rol varchar (100) UNIQUE
);

CREATE TABLE empleados (
id_empleado int primary key auto_increment,
usuario varchar (100) UNIQUE,
contrasena varchar (255),
nombre_empleado varchar (100),
dni_empleado varchar(100) UNIQUE,
direccion_empleado varchar (100),
telefono_empleado varchar (100),
mail_empleado varchar (100),
id_rol int,
foreign key (id_rol) references roles(id_rol) ON DELETE CASCADE
);

CREATE TABLE clientes (
id_cliente int primary key auto_increment,
nombre_cliente varchar (100),
dni_cliente varchar (100) UNIQUE,
direccion_cliente varchar (100),
celular_cliente varchar(100),
mail_cliente varchar(100)
);

CREATE TABLE especies (
id_especie int primary key auto_increment,
nombre_especie varchar (100) UNIQUE
);

CREATE TABLE razas (
id_raza int primary key auto_increment,
nombre_raza varchar (100) UNIQUE,
id_especie int,
foreign key (id_especie) references especies(id_especie) ON DELETE CASCADE
);

CREATE TABLE sucursales (
id_sucursal int primary key auto_increment,
nombre_sucursal varchar(100),
direccion_sucursal varchar(100),
celular_sucursal varchar (100)
);

CREATE TABLE historia_clinica (
id_historia_clinica int primary key auto_increment,
fecha_apertura datetime,
observaciones_generales varchar (100)
);

CREATE TABLE detalle_historia_clinica(
	id_detalle_historia_clinica int primary key auto_increment,
    observaciones text,
    id_historia_clinica int,
    id_sucursal int,
    id_venta int,
    foreign key (id_historia_clinica) references historia_clinica(id_historia_clinica) ON DELETE CASCADE,
	foreign key (id_sucursal) references sucursales(id_sucursal) ON DELETE CASCADE,
    foreign key (id_venta) references ventas(id_venta) ON DELETE CASCADE
);

CREATE TABLE mascotas (
id_mascota int primary key auto_increment,
nombre_mascota varchar(100),
edad_mascota varchar (3),
sexo_mascota varchar (100),
id_raza int,
id_cliente int,
id_historia_clinica int,
foreign key (id_raza) references razas(id_raza) ON DELETE CASCADE,
foreign key (id_cliente) references clientes(id_cliente) ON DELETE CASCADE,
foreign key (id_historia_clinica) references historia_clinica(id_historia_clinica) ON DELETE CASCADE
);

CREATE TABLE turnos (
id_turno int primary key auto_increment,
fecha_hora datetime,
motivo_turno varchar (100),
estado varchar (50),
id_cliente int,
id_mascota int,
id_empleado int,
foreign key (id_cliente) references clientes(id_cliente) ON DELETE CASCADE,
foreign key (id_mascota) references mascotas(id_mascota) ON DELETE CASCADE,
foreign key (id_empleado) references empleados(id_empleado) ON DELETE CASCADE
);

CREATE TABLE categorias (
id_categoria int primary key auto_increment,
nombre_categoria varchar (100) UNIQUE
);

CREATE TABLE productos (
id_producto int primary key auto_increment,
nombre_producto varchar(100),
codigo_producto varchar(100) UNIQUE,
precio_producto varchar(100),
id_categoria int,
foreign key (id_categoria) references categorias(id_categoria) ON DELETE CASCADE
);

CREATE TABLE stock (
id_stock int primary key auto_increment,
cantidad int,
fecha_ingreso datetime,
observaciones_stock varchar (100),
id_producto int,
id_sucursal int,
foreign key (id_producto) references productos(id_producto) ON DELETE CASCADE,
foreign key (id_sucursal) references sucursales(id_sucursal) ON DELETE CASCADE
);

CREATE TABLE proveedores (
id_proveedor int primary key auto_increment,
nombre_proveedor varchar(100),
direccion_proveedor varchar(100),
celular_proveedor varchar(100),
mail_proveedor varchar(100)
);

CREATE TABLE proveedor_productos (
id_proveedor_productos int primary key auto_increment,
id_proveedor int,
id_producto int,
foreign key (id_proveedor) references proveedores(id_proveedor) ON DELETE CASCADE,
foreign key (id_producto) references productos (id_producto) ON DELETE CASCADE
);

CREATE TABLE ventas(
	id_venta int primary key auto_increment,
    fecha_hora datetime,
    total varchar(100),
    id_cliente int,
    id_empleado int,
    foreign key (id_cliente) references clientes(id_cliente) ON DELETE CASCADE,
    foreign key (id_empleado) references empleados(id_empleado) ON DELETE CASCADE
);

CREATE TABLE detalles_ventas(
	id_detalle_venta int primary key auto_increment,
    cantidad varchar(100),
    precio_unitario varchar(100),
    sub_total varchar(100),
    id_venta int, 
    id_producto int,
    foreign key (id_venta) references ventas(id_venta),
    foreign key (id_producto) references productos(id_producto)
);

CREATE TABLE compras(
	id_compra int primary key auto_increment,
    total varchar(100),
    fecha_hora datetime,
    id_empleado int,
    foreign key (id_empleado) references empleados(id_empleado)
);

CREATE TABLE detalles_compras(
	id_detalle_compra int primary key auto_increment,
    cantidad varchar(100),
    precio_unitario varchar(100),
    sub_total varchar(100),
    id_producto int, 
    id_compra int,
    foreign key (id_producto) references productos(id_producto),
    foreign key (id_compra) references compras(id_compra)
);

