import { useState, useEffect } from 'react';
import { proveedores } from '../../endpoints/endpoints';
import axios from 'axios';
import { Card} from "react-bootstrap";

const VerProveedor = ({ id }) => {
  //se recibe el id como prop

  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    if (!id) return;

    const cargarProveedor = async () => {
      try {
        const response = await axios.get(`${proveedores}/ver/${id}`, { withCredentials: true });
        setProveedor(response.data);
      } catch (error) {
        console.error("Error al obtener el proveedor:", error);
      }
    };
    cargarProveedor();
  }, [id]);

  if (!proveedor) return <p>Cargando proveedor...</p>;

  return (
    <>
      <Card className="m-4 p-4 shadow">
        <Card.Body>
          <Card.Title className="mb-3">{proveedor.nombre_proveedor}</Card.Title>
          <Card.Text><strong>Dirección:</strong> {proveedor.direccion_proveedor}</Card.Text>
          <Card.Text><strong>Celular:</strong> {proveedor.celular_proveedor}</Card.Text>
          <Card.Text><strong>Email:</strong> {proveedor.mail_proveedor}</Card.Text>
          <Card.Text>
            <strong>Fecha y hora de alta:</strong>{" "}
            {new Date(proveedor.fecha_hora_alta_proveedor).toLocaleString("es-AR", {
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

export default VerProveedor