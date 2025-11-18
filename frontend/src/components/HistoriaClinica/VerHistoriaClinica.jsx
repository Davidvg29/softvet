import { useState, useEffect } from 'react';
import { historiasClinicas} from '../../endpoints/endpoints'
import axios from 'axios';
import { Card } from "react-bootstrap";

const VerHistoriaClinica = ({id}) => {
  //se recibe el id como prop

  const [historiaClinica, setHistoriaClinica] = useState(null);

  useEffect(() => {
    if (!id) return;

    const cargarhistoriaClinica = async () => {
      try {
        const response = await axios.get(`${historiasClinicas}/ver/${id}`, { withCredentials: true });
        setHistoriaClinica(response.data);
      } catch (error) {
        console.error("Error al obtener la historiaClinica:", error);
      }
    };
    cargarhistoriaClinica();
  }, [id]);

  if (!historiaClinica) return <p>Cargando historia Clinica...</p>;

  return (
    <>
      <Card className="m-4 p-4 shadow"
        style={{
          backgroundColor: "#cfcfcf",
          borderRadius: "10px",
          padding: "25px 40px",
          color: "#000",
        }}
      >
        <Card.Body>
          <Card.Title className="mb-3">{historiaClinica.nombre_cliente}</Card.Title>
          <Card.Text><strong>Nombre mascota:</strong> {historiaClinica.nombre_mascota}</Card.Text>
          <Card.Text><strong>Veterinario:</strong> {historiaClinica.veterinario}</Card.Text>
          <Card.Text><strong>Observaciones:</strong> {historiaClinica.observaciones_generales}</Card.Text>
          <Card.Text>
            <strong>Fecha y hora de alta:</strong>{" "}
            {new Date(historiaClinica.fecha_apertura).toLocaleString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default VerHistoriaClinica