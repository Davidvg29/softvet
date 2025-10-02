USE db_softvet;

INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Veterinario'),
('Recepcionista');

INSERT INTO empleados (usuario, contrasena, nombre_empleado, dni_empleado, direccion_empleado, telefono_empleado, mail_empleado, id_rol) VALUES
('admin01', '123456', 'Joaquin', '12345670', 'Av. Siempre Viva 123', '3814556677', 'joaquin@vet.com', 1),
('vet01', '', 'Mariano', '12345671', 'Calle San Martín 456', '3814551122', 'mariano@vet.com', 2),
('recep01', '123456', 'Angel', '12345672', 'Belgrano 789', '3814223344', 'angel@vet.com', 3),
('recep02', '123456', 'David', '12345673', 'Vallistos m6 c21', '3814223344', 'david@vet.com', 3);

INSERT INTO clientes (nombre_cliente, dni_cliente, direccion_cliente, celular_cliente, mail_cliente) VALUES
('María García', '40123456', 'Independencia 456', '3814332211', 'maria@gmail.com'),
('Pedro Fernández', '41123456', 'San Lorenzo 789', '3814667788', 'pedro@gmail.com'),
('Lucía Martínez', '42123456', 'Av. Mitre 101', '3814889900', 'lucia@hotmail.com');

INSERT INTO especies (nombre_especie) VALUES
('Perro'),
('Gato');

INSERT INTO razas (nombre_raza, id_especie) VALUES
('Labrador', 1),
('Caniche', 1),
('Siames', 2),
('Persa', 2);

INSERT INTO sucursales (nombre_sucursal, direccion_sucursal, celular_sucursal) VALUES
('Sucursal Centro', 'Av. Roca 123', '3814001122'),
('Sucursal Norte', 'Av. Alem 456', '3814556677');

INSERT INTO historia_clinica (fecha_apertura, observaciones_generales) VALUES
(NOW(), 'Paciente con historial de controles regulares'),
(NOW(), 'Chequeos anuales');

INSERT INTO mascotas (nombre_mascota, edad_mascota, sexo_mascota, id_raza, id_cliente, id_historia_clinica) VALUES
('Firulais', '5', 'Macho', 1, 1, 1),
('Luna', '3', 'Hembra', 2, 2, 2),
('Michi', '2', 'Macho', 3, 3, 2);

INSERT INTO turnos (fecha_hora, motivo_turno, estado, id_cliente, id_mascota, id_empleado) VALUES
(NOW(), 'Vacunación anual', 'Pendiente', 1, 1, 2),
(NOW(), 'Consulta general', 'Pendiente', 2, 2, 2);


INSERT INTO categorias (nombre_categoria) VALUES
('Medicamentos'),
('Accesorios'),
('Alimentos');

INSERT INTO productos (nombre_producto, codigo_producto, precio_producto, id_categoria) VALUES
('Vacuna Antirrábica', 'MED001', '1500.00', 1),
('Collar antipulgas', 'ACC001', '2500.00', 2),
('Bolsa alimento perro 10kg', 'ALI001', '12000.00', 3);

INSERT INTO stock (cantidad, fecha_ingreso, observaciones_stock, id_producto, id_sucursal) VALUES
(50, NOW(), 'Lote octubre', 1, 1),
(30, NOW(), 'Ingreso semanal', 2, 1),
(20, NOW(), 'Ingreso de sabados', 3, 2);

INSERT INTO proveedores (nombre_proveedor, direccion_proveedor, celular_proveedor, mail_proveedor) VALUES
('Vet Supplies SA', 'Ruta 9 km 120', '3814998877', 'ventas@vetsupplies.com'),
('Animal Foods SRL', 'Av. Libertad 200', '3814332211', 'info@animalfoods.com');

INSERT INTO proveedor_productos (id_proveedor, id_producto) VALUES
(1, 1),
(1, 2),
(2, 3);

INSERT INTO ventas (fecha_hora, total, id_cliente, id_empleado) VALUES
(NOW(), '1500.00', 1, 2),
(NOW(), '14500.00', 2, 2);

INSERT INTO detalles_ventas (cantidad, precio_unitario, sub_total, id_venta, id_producto) VALUES
('1', '1500.00', '1500.00', 1, 1),
('1', '12000.00', '12000.00', 2, 3),
('1', '2500.00', '2500.00', 2, 2);

INSERT INTO compras (total, fecha_hora, id_empleado) VALUES
('20000.00', NOW(), 1),
('15000.00', NOW(), 1);

INSERT INTO detalles_compras (cantidad, precio_unitario, sub_total, id_producto, id_compra) VALUES
('10', '1500.00', '15000.00', 1, 1),
('20', '2500.00', '50000.00', 2, 1),
('15', '1000.00', '15000.00', 3, 2);
