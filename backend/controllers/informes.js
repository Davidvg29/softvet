const { connection } = require('../config/bd/dataBase');

// INFORME 1 — Ventas por fecha
const informeVentasPorFecha = (req, res) => {
    // 1. Desestructurar todos los filtros del body
    const { fechaInicio, fechaFin, idCliente, idEmpleado } = req.body;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: "Fechas requeridas." });
    }

    // 2. Definir la consulta base con los JOIN necesarios
    let sql = `
        SELECT 
            v.id_venta, 
            c.nombre_cliente AS cliente,
            e.nombre_empleado AS empleado, 
            CAST(v.total AS DECIMAL(10, 2)) AS total_venta, 
            DATE_FORMAT(v.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora
        FROM ventas v
        INNER JOIN clientes c ON v.id_cliente = c.id_cliente
        INNER JOIN empleados e ON v.id_empleado = e.id_empleado 
        WHERE DATE(v.fecha_hora) BETWEEN ? AND ?
    `;

    // 3. Inicializar los parámetros con las fechas
    const params = [fechaInicio, fechaFin];

    // 4. Lógica condicional para añadir filtros
    
    // Filtro por Cliente
    if (idCliente) {
        sql += ` AND v.id_cliente = ?`;
        params.push(idCliente);
    }

    // Filtro por Empleado
    if (idEmpleado) {
        sql += ` AND v.id_empleado = ?`;
        params.push(idEmpleado);
    }

    // 5. Añadir la ordenación final
    sql += ` ORDER BY v.fecha_hora ASC;`;

    // 6. Ejecutar la consulta con todos los parámetros
    connection.query(sql, params, (error, results) => {
        if (error) {
            console.error("Error Informe Ventas con Filtros:", error);
            return res.status(500).json({ message: "Error al generar informe", detail: error.message });
        }
        
        // Devolver los resultados filtrados
        res.json(results); 
    });
};


// INFORME 2 — Turnos por fecha
const informeTurnosPorFecha = (req, res) => {
    // 1. Desestructurar todos los filtros del body
    const { fechaInicio, fechaFin, idCliente, idEmpleado, estadoTurno } = req.body; 

    // Asegurar que se envían las fechas
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "Debes enviar fechaInicio y fechaFin" });
    }

    // 2. Definir la consulta base con los JOIN necesarios
    let sql = `
        SELECT t.id_turno, 
               t.estado,
               -- Usamos DATE y TIME en la columna 'fecha_hora'
               DATE(t.fecha_hora) AS fecha, 
               TIME(t.fecha_hora) AS hora, 
               c.nombre_cliente AS cliente, 
               m.nombre_mascota AS mascota, 
               e.nombre_empleado AS empleado 
        FROM turnos t
        JOIN clientes c ON t.id_cliente = c.id_cliente
        JOIN mascotas m ON t.id_mascota = m.id_mascota
        JOIN empleados e ON t.id_empleado = e.id_empleado
        -- Usar DATE en la columna 'fecha_hora' para la comparación
        WHERE DATE(t.fecha_hora) BETWEEN ? AND ?
    `;

    // 3. Inicializar los parámetros con las fechas
    const params = [fechaInicio, fechaFin];

    // 4. Lógica condicional para añadir filtros opcionales
    
    // Filtro por Cliente
    if (idCliente) {
        sql += ` AND t.id_cliente = ?`;
        params.push(idCliente);
    }

    // Filtro por Empleado
    if (idEmpleado) {
        sql += ` AND t.id_empleado = ?`;
        params.push(idEmpleado);
    }
    
    // Filtro: Estado del Turno
    if (estadoTurno) {
        sql += ` AND t.estado = ?`;
        params.push(estadoTurno);
    }

    // 5. Añadir la ordenación final
    // Usamos los alias 'fecha' y 'hora' definidos en el SELECT
    sql += ` ORDER BY fecha ASC, hora ASC;`; 

    // 6. Ejecutar la consulta con todos los parámetros
    connection.query(sql, params, (error, results) => {
    
    console.log(`[DEBUG] Parámetros recibidos: ${params.join(', ')}`);
    console.log(`[DEBUG] Turnos encontrados: ${results.length}`);
    if (results.length > 0) {
        console.log("[DEBUG] Primer resultado:", results[0]);
    }

    return res.json(results);

        if (error) {
           
            console.error("Error Informe Turnos con Filtros:", error.message);
            // Si quieres ver el SQL que falló: console.error("SQL Fallida:", sql);
            return res.status(500).json({ 
                error: "Error al obtener los turnos", 
                detalle: error.message // Enviamos el detalle de MySQL al frontend
            });
        }

        return res.json(results);
    });
};

const informeEmpleadoMasVentas = (req, res) => {
    // Obtenemos los filtros del body de la petición
    const { fechaInicio, fechaFin, idCliente, idEmpleado } = req.body;

    // 1. Validación de fechas (obligatorio para el informe)
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "Debes seleccionar ambas fechas." });
    }

    // 2. Construcción de la Consulta SQL
    let sql = `
        SELECT 
            e.id_empleado, 
            e.nombre_empleado, 
            e.dni_empleado, 
            COUNT(v.id_venta) AS cantidad_ventas,
            -- ⭐️ CORRECCIÓN PRINCIPAL: Usamos 'v.total' y lo convertimos a DECIMAL para SUMAR
            SUM(CAST(v.total AS DECIMAL(10, 2))) AS total_vendido
        FROM empleados e
        JOIN ventas v ON e.id_empleado = v.id_empleado
        WHERE DATE(v.fecha_hora) BETWEEN ? AND ?
    `;

    const params = [fechaInicio, fechaFin];

    // 3. Lógica para filtros opcionales (sin cambios)
    
    // Filtro por Cliente
    if (idCliente) {
        const id = parseInt(idCliente);
        if (id > 0) { 
            sql += ` AND v.id_cliente = ?`;
            params.push(id);
        }
    }
    
    // Filtro por Empleado
    if (idEmpleado) {
        const id = parseInt(idEmpleado);
        if (id > 0) {
            sql += ` AND e.id_empleado = ?`;
            params.push(id);
        }
    }

    // 4. Agrupamiento y Ordenamiento
    sql += `
        GROUP BY e.id_empleado, e.nombre_empleado, e.dni_empleado 
        ORDER BY total_vendido DESC;
    `; 

    // 5. Ejecutar la consulta
    connection.query(sql, params, (error, results) => {
        if (error) {
            console.error("Error Informe Ranking Empleados:", error.message);
            return res.status(500).json({ 
                error: "Error al obtener el informe de ventas. Verifique si la columna 'total' de la tabla ventas contiene solo números válidos.", 
                detalle: error.message 
            });
        }

        return res.json(results);
    });
};
module.exports={
    informeVentasPorFecha,
    informeTurnosPorFecha,
    informeEmpleadoMasVentas
};
