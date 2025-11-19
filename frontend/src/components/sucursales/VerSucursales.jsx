import { useState, useEffect } from "react";
import { SUCURSALES } from "../../endpoints/endpoints";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const VerSucursales = ({ id_sucursal }) => {
  const [sucursal, setSucursal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_sucursal) return;

    const getSucursales = async () => {
      try {
        const response = await axios.get(`${SUCURSALES}/ver/${id_sucursal}`, {
          withCredentials: true,
        });

        if (response.data) {
          setSucursal(response.data);
          console.log("Datos de la sucursal recibida:", response.data);
        } else {
          setError("No se encontraron datos para la sucursal especificada.");
        }
      } catch (error) {
        console.error("Error al obtener la sucursal:", error);
        setError("Error al obtener la sucursal");
      }
    };

    getSucursales();
  }, [id_sucursal]);

  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  if (!sucursal)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando Sucursal...</p>
      </div>
    );

  return (
    <Card
      style={{
        margin: "2rem auto",
        padding: "2rem",
        width: "80%",
        maxWidth: "500px",
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
          Detalle de la Sucursal
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p>
            <strong style={{ color: "#6f42c1" }}>Nombre de la Sucursal:</strong>{" "}
            {sucursal.nombre_sucursal}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Direccion de la Sucursal:</strong>{" "}
            {sucursal.direccion_sucursal}
          </p>
            <p>
            <strong style={{ color: "#6f42c1" }}>Telefono de la Sucursal:</strong>{" "}
            {sucursal.celular_sucursal}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VerSucursales;