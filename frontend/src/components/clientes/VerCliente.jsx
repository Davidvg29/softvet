import { useState, useEffect } from "react";
import { clientes, mascotas } from "../../endpoints/endpoints";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const VerCliente = ({ id_cliente }) => {
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  const [listaMascotas, setListaMascotas] = useState([]);
  const [loadingMascotas, setLoadingMascotas] = useState(true);


  useEffect(() => {
    if (!id_cliente) return;

    const getCliente = async () => {
      try {
        const response = await axios.get(`${clientes}/ver/${id_cliente}`, {
          withCredentials: true,
        });
        setCliente(response.data);
      } catch (error) {
        console.error("Error al obtener el cliente:", error);
        setError("Error al obtener el cliente.");
      }
    };

    getCliente();
  }, [id_cliente]);

  // Traer mascotas del cliente
  useEffect(() => {
    if (!id_cliente) return;

    const getMascotas = async () => {
      try {
        const { data } = await axios.get(`${mascotas}/cliente/${id_cliente}`, {
          withCredentials: true,
        });
        setListaMascotas(data);
      } catch (error) {
        console.error("Error obteniendo mascotas:", error);
      } finally {
        setLoadingMascotas(false);
      }
    };

    getMascotas();
  }, [id_cliente]);


  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );


  if (!cliente)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando Cliente...</p>
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
          CLIENTE: {cliente.nombre_cliente}
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p>
            <strong style={{ color: "#6f42c1" }}>DNI:</strong>{" "}
            {cliente.dni_cliente}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Dirección:</strong>{" "}
            {cliente.direccion_cliente}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Teléfono:</strong>{" "}
            {cliente.celular_cliente}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Email:</strong>{" "}
            {cliente.mail_cliente}
          </p>

          <hr />

          <h5 style={{ marginTop: "1rem", fontWeight: "bold", textAlign: "center" }}>
            Mascotas:
          </h5>

          {loadingMascotas ? (
            <p style={{ textAlign: "center" }}>Cargando mascotas...</p>
          ) : listaMascotas.length === 0 ? (
            <p style={{ textAlign: "center" }}>No tiene</p>
          ) : (
            <div style={{ marginTop: "10px" }}>
              {listaMascotas.map((m, index) => (
                <div
                  key={m.id_mascota || index}
                  style={{
                    textAlign: "center",
                    padding: "15px 0", // Más espacio arriba y abajo
                    borderBottom: index !== listaMascotas.length - 1 ? "1px solid #e9ecef" : "none", // Línea divisora sutil
                    width: "100%"
                  }}
                >
                  <div style={{
                    fontWeight: "bold",
                    color: "#2c3e50",
                    fontSize: "1.1rem",
                    marginBottom: "2px"
                  }}>
                    {m.nombre_mascota}
                  </div>
                  <div style={{
                    fontSize: "0.95rem",
                    color: "#3f3f3f",
                    fontStyle: "italic" // Un toque elegante para diferenciarlo del nombre
                  }}>
                    {m.nombre_especie} — {m.nombre_raza}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </Card.Body>
    </Card>
  );
};

export default VerCliente;