import { useState, useEffect } from 'react';
import { ESPECIES } from '../../endpoints/endpoints';
import axios from 'axios';
import { Card } from "react-bootstrap";

const VerEspecies = ({id_especie}) => {
    //se recibe el id como prop
    
    const [especie,setEspecie] = useState(null);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(!id_especie) return;

        const getEspecies = async () =>{ 
            try {
                const response=await axios.get(`${ESPECIES}/ver/${id_especie}` ,{withCredentials:true});
                
                if (response.data) {
                setEspecie(response.data);
                console.log("Datos de la especie recibida:", response.data);
            } else {
                   setError("No se encontraron datos para la especie.");
                console.error("No se encontraron datos para la especie.");
            } 
            }
            catch (error) {
                console.error("Error al obtener especies:",error);
                setError("Error al obtener especies");
            }
        };
        getEspecies();
    },[id_especie])

    if (error) return <p className='text-danger'>{error}</p>;
    if (!especie) return <p>Cargando especies...</p>;

    return (
        <>
            <Card className="m-4 p-4 shadow">
                <Card.Body>
                    <Card.Title className="mb-3">Especie: {especie.nombre_especie}</Card.Title>

                </Card.Body>
            </Card>

        </>
    )
}

export default VerEspecies;