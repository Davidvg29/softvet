import React, { useState } from "react";
import { Modal, Card, Row, Col } from "react-bootstrap";

import InformeVentas from "./InformeVentas";
import InformeTurnos from "./InformeTurnos";
import InformeEmpleadoMasVentas from "./InformeEmpleadoMasVentas";

export const MainInforme = () => {
    const [modal, setModal] = useState(null);

    const abrir = (nombre) => setModal(nombre);
    const cerrar = () => setModal(null);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Informes</h2>

            {/* ---------- CARDS ---------- */}
            <Row className="d-flex justify-content-center">
                <Col Col xs="auto" md={4}>
                    <Card
                        className="shadow p-3 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => abrir("ventasFecha")}
                    >
                        <Card.Body>
                            <Card.Title>Ventas por Fecha</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>

                <Col Col xs="auto" md={4}>
                    <Card
                        className="shadow p-3 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => abrir("turnosFecha")}
                    >
                        <Card.Body>
                            <Card.Title>Turnos por Fecha</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>

                <Col Col xs="auto" md={4}>
                    <Card
                        className="shadow p-3 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => abrir("empleadoMasVentas")}
                    >
                        <Card.Body>
                            <Card.Title>Empleado con Más Ventas</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ---------- MODAL ÚNICO ---------- */}
            <Modal
                show={modal !== null}
                onHide={cerrar}
                size="lg"
                centered
                backdrop="static"
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #FFD700, #32CD32)',
                        padding: '25px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                    }}
                >

                    {/* BOTÓN DE CIERRE PERSONALIZADO */}
                    <button
                        onClick={cerrar}
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
                            zIndex: 9999,
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
                    >
                        ✕
                    </button>

                    {/* CONTENIDO DEL MODAL */}
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
                            {modal === "ventasFecha" && "Informe de Ventas"}
                            {modal === "turnosFecha" && "Informe de Turnos"}
                            {modal === "empleadoMasVentas" && "Empleado con Más Ventas"}
                        </h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {modal === "ventasFecha" && <InformeVentas />}
                            {modal === "turnosFecha" && <InformeTurnos />}
                            {modal === "empleadoMasVentas" && <InformeEmpleadoMasVentas />}
                        </div>
                    </div>
                </div>
            </Modal>


        </div >
    );
};
