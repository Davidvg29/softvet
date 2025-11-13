import { useState, useEffect } from "react";
import { empleados, ROLES } from "../../endpoints/endpoints";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const VerEmpleado = ({ id_empleado }) => {
  const [empleado, setEmpleado] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${ROLES}/ver`, { withCredentials: true });
        const rolesData = response.data.map((r) => ({
          ...r,
          id_rol: Number(r.id_rol),
        }));
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        setError("Error al cargar los roles.");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!id_empleado) return;

    const getEmpleado = async () => {
      try {
        const response = await axios.get(`${empleados}/ver/${id_empleado}`, {
          withCredentials: true,
        });
        if (response.data) {
          setEmpleado({ ...response.data, id_rol: Number(response.data.id_rol) });
        } else {
          setError("No se encontraron datos para el empleado especificado.");
        }
      } catch (error) {
        console.error("Error al obtener el empleado:", error);
        setError("Error al obtener el empleado.");
      }
    };

    getEmpleado();
  }, [id_empleado]);

  if (error)
    return (
      <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  if (!empleado || roles.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#555" }}>Cargando empleado...</p>
      </div>
    );

  const rolEmpleado = roles.find((rol) => rol.id_rol === empleado.id_rol);

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
          EMPLEADO: {empleado.nombre_empleado}
        </Card.Title>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
          <p>
            <strong style={{ color: "#6f42c1" }}>DNI:</strong>{" "}
            {empleado.dni_empleado}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Dirección:</strong>{" "}
            {empleado.direccion_empleado}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Teléfono:</strong>{" "}
            {empleado.telefono_empleado}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Email:</strong>{" "}
            {empleado.mail_empleado}
          </p>
          <p>
            <strong style={{ color: "#6f42c1" }}>Rol:</strong>{" "}
            {empleado.nombre_rol}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VerEmpleado;
