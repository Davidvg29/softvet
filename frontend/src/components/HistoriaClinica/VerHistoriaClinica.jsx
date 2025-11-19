import { useState, useEffect } from 'react';
import { historiasClinicas, detalleHistoriasClinicas } from '../../endpoints/endpoints';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Card, Button, Row, Col } from "react-bootstrap";
import EditarDetalleHistoriaClinica  from './EditarDetalleHistoriaClinica';

const VerHistoriaClinica = ({ id }) => {

    const [historiaClinica, setHistoriaClinica] = useState(null);
    const [detallesClinicos, setDetallesClinicos] = useState([]);


    const [showModal, setShowModal] = useState(false);
    const [fromType, setFromType] = useState("");
   
    const [detalleIdParaEditar, setDetalleIdParaEditar] = useState(null); 
    
    
    const TITULOS = {
        editarDetalleHistoriaClinica: "Editar Detalle de Historia Clínica",
    };
    
    const cargarDetalleHistoriaClinica = async () => {
        if (!id) return;
        try {
            const response = await axios.get(`${detalleHistoriasClinicas}/ver/${id}`, { withCredentials: true });
            setDetallesClinicos(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDetallesClinicos([]);
            } else {
                console.error("Error al obtener los detalles clínicos:", error);
            }
        }
    };
    
    
    
    // Función de apertura modal
    const handleOpenModal = (type, detalleId) => {
        setFromType(type);
       
        setDetalleIdParaEditar(detalleId); 
        setShowModal(true);
    };

    // Función de cierre de la modal
    const handleCloseModal = () => {
        setShowModal(false);
        setFromType("");
        setDetalleIdParaEditar(null); // Limpiar el ID al cerrar
    };
    
    

    // Carga de la Historia Clínica General
    useEffect(() => {
        if (!id) return;
        const cargarhistoriaClinica = async () => {
            try {
                const response = await axios.get(`${historiasClinicas}/ver/${id}`, { withCredentials: true });
                setHistoriaClinica(response.data);
            } catch (error) {
                console.error("Error al obtener la historia Clínica:", error);
            }
        };
        cargarhistoriaClinica();
    }, [id]);

    // Carga de los Detalles Clínicos
    useEffect(() => {
        cargarDetalleHistoriaClinica();
    }, [id]); // Depende del ID de la HC
    
    // Función para recargar los detalles después de una edición exitosa
    const handleDetalleActualizado = () => {
        handleCloseModal(); // 1. Cerrar el modal
        cargarDetalleHistoriaClinica(); // 2. Recargar la lista de detalles
    };


    if (!historiaClinica) return <p>Cargando historia Clínica...</p>;


    return (
        <>
           
            <Card className="m-4 p-4 shadow" style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", color: "#000" }}>
                <Card.Body>
                    <Card.Title className="mb-3 text-center">
                        **Ficha General** (HC #{historiaClinica.id_historia_clinica})
                    </Card.Title>
                    <hr />
                    <Row>
                        <Col md={6}>
                            <Card.Text><strong>Cliente:</strong> {historiaClinica.nombre_cliente}</Card.Text>
                            <Card.Text><strong>Mascota:</strong> {historiaClinica.nombre_mascota}</Card.Text>
                        </Col>
                        <Col md={6}>
                            <Card.Text><strong>Veterinario Alta:</strong> {historiaClinica.veterinario}</Card.Text>
                            <Card.Text>
                                <strong>Alta:</strong>{" "}
                                {new Date(historiaClinica.fecha_apertura).toLocaleString("es-AR", {
                                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                                })}
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className='mt-3'>
                        <strong>Observaciones Generales:</strong> {historiaClinica.observaciones_generales}
                    </Card.Text>
                </Card.Body>
            </Card>


           {/* deatlles clinicos */}
            <h4 className="text-center mt-5 mb-3" style={{ color: '#6f42c1' }}>
                Historial de Atenciones ({detallesClinicos.length})
            </h4>

            {detallesClinicos && detallesClinicos.length > 0 ? (
                detallesClinicos.map((detalle, index) => (
                    <Card key={detalle.id_detalle_historia_clinica} className="m-4 p-4 shadow border-info"
                        style={{
                            backgroundColor: index % 2 === 0 ? "#e6f2ff" : "#f0f0f0",
                            borderRadius: "10px",
                            color: "#000",
                            borderLeft: "5px solid #007bff",
                            transition: "transform 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    >
                        <Card.Body>
                            <Row className="mb-2 align-items-center">
                                <Col>
                                    <Card.Title className="h6 mb-1">
                                        **Atención #**{detalle.id_detalle_historia_clinica}
                                    </Card.Title>
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        
                                        onClick={() => handleOpenModal("editarDetalleHistoriaClinica", detalle.id_detalle_historia_clinica)}
                                    >
                                        ✏️ Editar Detalle
                                    </Button>
                                </Col>
                            </Row>
                            <hr className='my-2' />
                            <Card.Text>
                                <strong>Fecha:</strong>{" "}
                                {new Date(detalle.fecha_atencion).toLocaleString("es-AR", {
                                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                                })}
                            </Card.Text>
                            <Card.Text>
                                <strong>Veterinario:</strong> {detalle.veterinario_atencion || "No asignado"}
                            </Card.Text>
                            <Card.Text className="mt-3">
                                **Diagnóstico / Observaciones:** {detalle.diagnostico_detalle}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-center text-muted">Aún no hay detalles de atención para esta historia clínica.</p>
            )}

            {/* MODAL */}
            <Modal show={showModal}
                onHide={handleCloseModal}
                centered
                backdrop="static"
                size="lg">

                <div
                    style={{
                        background: 'linear-gradient(135deg, #FFD700, #32CD32)',
                        padding: '25px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                    }}
                >
                    {/* Botón de cerrar */}
                    <button
                        onClick={handleCloseModal}
                        aria-label="Cerrar"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
                    >
                        ✕
                    </button>

                    {/* Caja interior del modal */}
                    <div
                        style={{
                            backgroundColor: '#cfcfcf',
                            padding: '30px 60px',
                            textAlign: 'center',
                            width: '700px',
                            margin: 'auto',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                        }}
                    >
                        <h4
                            style={{
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                marginBottom: '25px',
                            }}
                        >
                            {TITULOS[fromType]}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            {fromType === "editarDetalleHistoriaClinica" && (
                                <EditarDetalleHistoriaClinica 
                                    id={detalleIdParaEditar} // Pasamos el ID del detalle
                                    onClose={handleCloseModal} // Función para cerrar el modal
                                    onUpdated={handleDetalleActualizado} // Función para recargar la lista después de editar
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default VerHistoriaClinica;