import { useState, useEffect } from 'react';
import { categorias } from '../../endpoints/endpoints';
import axios from 'axios';
import { Card } from "react-bootstrap";

const VerCategorias = ({id_categoria}) => {
    //se recibe el id como prop
    
    const [categoria,setCategoria] = useState(null);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(!id_categoria) return;

        const getCategorias = async () =>{ 
            try {
                const response=await axios.get(`${categorias}/ver/${id_categoria}` ,{withCredentials:true});
                
                if (response.data) {
                setCategoria(response.data);
                console.log("Datos de la categoria recibida:", response.data);
            } else {
                   setError("No se encontraron datos para la categoria.");
                console.error("No se encontraron datos para la categoria.");
            } 
            }
            catch (error) {
                console.error("Error al obtener las categorias:",error);
                setError("Error al obtener categorias");
            }
        };
        getCategorias();
    },[id_categoria])

    if (error) return <p className='text-danger'>{error}</p>;
    if (!categoria) return <p>Cargando categorias...</p>;

    return (
        <>
            <Card className="m-4 p-4 shadow">
                <Card.Body>
                    <Card.Title className="mb-3">Categoria: {categoria.nombre_categoria}</Card.Title>

                </Card.Body>
            </Card>

        </>
    )
}

export default VerCategorias;