import { useState, useEffect } from 'react';
import { proveedores, TURNOS } from '../../endpoints/endpoints';
import axios from 'axios';
import { Card } from "react-bootstrap";

const VerTurno = ({ id_turno }) => {
  //se recibe el id como prop

  const [turno, setTurno] = useState(null);

  useEffect(() => {
    if (!id_turno) return;

    const cargarTurno = async () => {
      try {
        const response = await axios.get(`${TURNOS}/ver/${id_turno}`, { withCredentials: true });
        setTurno(response.data);
        
      } catch (error) {
        console.error("Error al obtener el turno:", error);
      }
    };
    cargarTurno();
  }, [id_turno]);

  if (!turno) return <p>Cargando turno...</p>;
console.log(turno);

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
          <Card.Title className="mb-3">{}</Card.Title>
          <Card.Text><strong>Cliente:</strong> {turno.nombre_cliente}</Card.Text>
          <Card.Text><strong>Mascota:</strong> {turno.nombre_mascota}</Card.Text>
          <Card.Text><strong>Fecha:</strong> {turno.fecha_hora.slice(0,10)}</Card.Text>
          <Card.Text><strong>Hora:</strong> {turno.fecha_hora.slice(11,16)}</Card.Text>
          <Card.Text><strong>Estado:</strong> {turno.estado}</Card.Text>
          <Card.Text><strong>Motivo:</strong> {turno.motivo_turno}</Card.Text>
          <Card.Text><strong>Empleado:</strong> {turno.nombre_empleado}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default VerTurno