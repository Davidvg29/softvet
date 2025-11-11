import { useState, useEffect } from "react";
import { ROLES } from "../../endpoints/endpoints";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const VerRoles = ({ id_rol }) => {
  const [rol, setRol] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_rol) return;

    const getRoles = async () => {
      try {
        const response = await axios.get(`${ROLES}/ver/${id_rol}`, {
          withCredentials: true,
        });

        if (response.data) {
          setRol(response.data);
          console.log("Datos del rol recibido:", response.data);
        } else {
          setError("No se encontraron datos para el rol especificado.");
        }
      } catch (error) {
        console.error("Error al obtener el Rol:", error);
        setError("Error al obtener el Rol");
      }
    };

    getRoles();
  }, [id_rol]);

  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  if (!rol)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando rol...</p>
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
          Detalle del Rol
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p>
            <strong style={{ color: "#6f42c1" }}>Nombre del rol:</strong>{" "}
            {rol.nombre_rol}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VerRoles;