import { useState, useEffect } from 'react';
import {razas} from '../../endpoints/endpoints'
import axios from 'axios';
import { Card } from "react-bootstrap";
const VerRaza = ({ id }) => {
    //se recibe el id como prop

    const [raza, setRaza] = useState(null);

    useEffect(() => {
        if (!id) return;

        const cargarRazas = async () => {
            try {
                const response = await axios.get(`${razas}/ver/${id}`, { withCredentials: true });
                setRaza(response.data);
            } catch (error) {
                console.error("Error al obtener la raza:", error);
            }
        };
        cargarRazas();
    }, [id]);

    if (!raza) return <p>Cargando raza...</p>;

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
                    <Card.Title className="mb-3">{raza.nombre_raza}</Card.Title>
                    <Card.Text><strong>Nombre:</strong> {raza.nombre_raza}</Card.Text>
                    <Card.Text><strong>Especie:</strong> {raza.nombre_especie}</Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}

export default VerRaza