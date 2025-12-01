import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { STOCK } from "../../endpoints/endpoints";

const VerStock = ({ id_producto }) => {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_producto) return;

    const fetchStockProducto = async () => {
      try {
        const response = await axios.get(
          `${STOCK}/ver/producto/${id_producto}`,
          { withCredentials: true }
        );

        setDetalle(response.data); 
      } catch (error) {
        console.error("Error al obtener el stock del producto:", error);
        setError("Error al obtener el stock del producto.");
      }
    };

    fetchStockProducto();
  }, [id_producto]); // 

  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  if (!detalle)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando información...</p>
      </div>
    );

  const {
    nombre_producto,
    codigo_producto,
    precio_producto,
    nombre_categoria,
    cantidad_total,
    fecha_ultimo_ingreso,
    observaciones_stock,
  } = detalle;

  return (
    <Card
      style={{
        margin: "2rem auto",
        padding: "2rem",
        width: "80%",
        maxWidth: "650px",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card.Body>
        <Card.Title
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.6rem",
            fontWeight: "bold",
            color: "#2c3e50",
            textAlign: "center",
          }}
        >
          STOCK DEL PRODUCTO
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p>
            <strong style={{ color: "#6f42c1" }}>Producto:</strong>{" "}
            {nombre_producto}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Código:</strong>{" "}
            {codigo_producto}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Precio:</strong>{" "}
            {precio_producto}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Categoría:</strong>{" "}
            {nombre_categoria || "Sin categoría"}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Cantidad total en stock:</strong>{" "}
            {cantidad_total}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Último ingreso:</strong>{" "}
            {fecha_ultimo_ingreso
              ? new Date(fecha_ultimo_ingreso).toLocaleString()
              : "Sin movimientos"}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Otras Observaciones:</strong>{" "}
            {observaciones_stock || "Sin observaciones"}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VerStock;