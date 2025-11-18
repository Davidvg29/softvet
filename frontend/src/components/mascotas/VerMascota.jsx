import { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { mascotas } from "../../endpoints/endpoints";

const VerMascota = ({ id_mascota }) => {
  const [mascota, setMascota] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_mascota) return;

    const getMascota = async () => {
      try {
        const response = await axios.get(`${mascotas}/ver/${id_mascota}`, {
          withCredentials: true,
        });

        console.log("DATA RECIBIDA:", response.data);

        // Si devuelve array, toma la primera
        if (Array.isArray(response.data)) {
          setMascota(response.data[0]);
        } else {
          setMascota(response.data);
        }
        
      } catch (error) {
        console.error("Error al obtener la Mascota:", error);
        setError("Error al obtener la Mascota.");
      }
    };

    getMascota();
  }, [id_mascota]);

  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  if (!mascota)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando Mascota...</p>
      </div>
    );

  return (
    <Card
      style={{
        margin: "2rem auto",
        padding: "2rem",
        width: "80%",
        maxWidth: "600px",
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
          MASCOTA: {mascota.nombre_mascota}
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p><strong style={{ color: "#6f42c1" }}>EDAD:</strong> {mascota.edad_mascota}</p>
          <p><strong style={{ color: "#6f42c1" }}>SEXO:</strong> {mascota.sexo_mascota}</p>
          <p><strong style={{ color: "#6f42c1" }}>RAZA:</strong> {mascota.nombre_raza}</p>
          <p><strong style={{ color: "#6f42c1" }}>ESPECIE:</strong> {mascota.nombre_especie}</p>
          <p><strong style={{ color: "#6f42c1" }}>DNI CLIENTE:</strong> {mascota.dni_cliente}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VerMascota;