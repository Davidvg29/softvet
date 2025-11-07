import { useState, useEffect } from 'react';
import { ROLES } from '../../endpoints/endpoints';
import axios from 'axios';
import { Card } from "react-bootstrap";

const VerRoles = ({id_rol}) => {
    //se recibe el id como prop
    
    const [rol,setRol] = useState(null);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(!id_rol) return;

        const getRoles = async () =>{ 
            try {
                const response=await axios.get(`${ROLES}/ver/${id_rol}` ,{withCredentials:true});
                
                if (response.data) {
                setRol(response.data);
                console.log("Datos del rol recibido:", response.data);
            } else {
                   setError("No se encontraron datos para el rol especificado.");
                console.error("No se encontraron datos para el rol especificado.");
            } 
            }
            catch (error) {
                console.error("Error al obtener el Rol:",error);
                setError("Error al obtener el Rol");
            }
        };
        getRoles();
    },[id_rol])

    if (error) return <p className='text-danger'>{error}</p>;
    if (!rol) return <p>Cargando Roles...</p>;

    return (
        <>
            <Card className="m-4 p-4 shadow">
                <Card.Body>
                    <Card.Title className="mb-3">ROL: {rol.nombre_rol}</Card.Title>

                </Card.Body>
            </Card>

        </>
    )
}

export default VerRoles;