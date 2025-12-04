import React, { useState } from "react";
import { Modal, Card, Row, Col } from "react-bootstrap";
import { FaChartBar, FaChartLine, FaCalendarCheck, FaUserTie } from "react-icons/fa";

import InformeVentas from "./InformeVentas";
import InformeTurnos from "./InformeTurnos";
import InformeEmpleadoMasVentas from "./InformeEmpleadoMasVentas";

export const MainInforme = () => {
    const [modal, setModal] = useState(null);

    const abrir = (nombre) => setModal(nombre);
    const cerrar = () => setModal(null);

    return (
        <div className="container mt-4 d-flex flex-column align-items-center">


            <style>
                {`
          .animate-title {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeSlide 0.6s ease-out forwards;
          }

          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card-softvet {
            transition: all 0.25s ease;
          }

          .card-softvet:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(111, 66, 193, 0.35);
          }
        `}
            </style>


            <div className="text-center mb-4">
                <h2
                    className="fw-bold animate-title p-2 mb-2 d-inline-block"
                    style={{
                        background: "linear-gradient(90deg, #6f42c1, #8f41aeff)",
                        fontSize: "2.2rem",
                        color: "#fff",
                        marginTop: "10px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        borderRadius: "12px",
                        padding: "10px 26px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <FaChartLine size={32} style={{ marginRight: "8px" }} />
                    Informes
                </h2>
                <p style={{ marginTop: "5px", color: "#555" }}>
                    Visualiza reportes clave del sistema SoftVet
                </p>
            </div>

            {/* ---------- CARDS ---------- */}
            <Row className="d-flex justify-content-center w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center mb-3">
                    <Card
                        className="shadow text-center card-softvet"
                        style={{
                            cursor: "pointer",
                            borderRadius: "16px",
                            border: "2px solid #6f42c1",
                            width: "100%",
                            maxWidth: "320px",
                            background:
                                "linear-gradient(135deg, rgba(111,66,193,0.08), rgba(187,44,244,0.1))",
                        }}
                        onClick={() => abrir("ventasFecha")}
                    >
                        <Card.Body style={{ padding: "22px 16px" }}>
                            <FaChartBar size={40} color="#6f42c1" style={{ marginBottom: "10px" }} />
                            <Card.Title
                                style={{
                                    fontWeight: "bold",
                                    color: "#6f42c1",
                                    marginBottom: "8px",
                                }}
                            >
                                Ventas por Fecha
                            </Card.Title>
                            <Card.Text style={{ fontSize: "0.95rem", color: "#555" }}>
                                Consulta el total de ventas entre dos fechas específicas.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4} className="d-flex justify-content-center mb-3">
                    <Card
                        className="shadow text-center card-softvet"
                        style={{
                            cursor: "pointer",
                            borderRadius: "16px",
                            border: "2px solid #6f42c1",
                            width: "100%",
                            maxWidth: "320px",
                            background:
                                "linear-gradient(135deg, rgba(111,66,193,0.08), rgba(187,44,244,0.1))",
                        }}
                        onClick={() => abrir("turnosFecha")}
                    >
                        <Card.Body style={{ padding: "22px 16px" }}>
                            <FaCalendarCheck size={40} color="#6f42c1" style={{ marginBottom: "10px" }} />
                            <Card.Title
                                style={{
                                    fontWeight: "bold",
                                    color: "#6f42c1",
                                    marginBottom: "8px",
                                }}
                            >
                                Turnos por Fecha
                            </Card.Title>
                            <Card.Text style={{ fontSize: "0.95rem", color: "#555" }}>
                                Obtén informes de turnos otorgados en un rango de fechas.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4} className="d-flex justify-content-center mb-3">
                    <Card
                        className="shadow text-center card-softvet"
                        style={{
                            cursor: "pointer",
                            borderRadius: "16px",
                            border: "2px solid #6f42c1",
                            width: "100%",
                            maxWidth: "320px",
                            background:
                                "linear-gradient(135deg, rgba(111,66,193,0.08), rgba(187,44,244,0.1))",
                        }}
                        onClick={() => abrir("empleadoMasVentas")}
                    >
                        <Card.Body style={{ padding: "22px 16px" }}>
                            <FaUserTie size={40} color="#6f42c1" style={{ marginBottom: "10px" }} />
                            <Card.Title
                                style={{
                                    fontWeight: "bold",
                                    color: "#6f42c1",
                                    marginBottom: "8px",
                                }}
                            >
                                Empleado con Más Ventas
                            </Card.Title>
                            <Card.Text style={{ fontSize: "0.95rem", color: "#555" }}>
                                Identifica al empleado con mejor desempeño en ventas.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ---------- MODAL ÚNICO ---------- */}
            <Modal show={modal !== null} 
            onHide={cerrar} 
            size="lg" 
            centered backdrop="static" > 
            <div 
            style={{ background: 'linear-gradient(135deg, #FFD700, #32CD32)', 
                padding: '25px', 
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)', 
                position: 'relative', 
            }} > 
            {/* BOTÓN DE CIERRE PERSONALIZADO */} 
            <button onClick={cerrar} aria-label="Cerrar" 
            style={{ position: 'absolute', 
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
                zIndex: 9999, }} 
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')} 
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')} > ✕ </button> 
                
                {/* CONTENIDO DEL MODAL */} 
                <div
                style={{ backgroundColor: '#cfcfcf', 
                    padding: '30px 60px', 
                    textAlign: 'center', 
                    width: '700px', 
                    margin: 'auto', 
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', 
                    borderRadius: '12px', 
                }} > 
                <h4 
                style={{ fontWeight: 'bold', 
                    textDecoration: 'underline', 
                    marginBottom: '25px', 
                }} > 
                {modal === "ventasFecha" && "Informe de Ventas"} 
                {modal === "turnosFecha" && "Informe de Turnos"} 
                {modal === "empleadoMasVentas" && "Empleado con Más Ventas"} 
                </h4> 
                <div 
                style={{ display: "flex", 
                    flexDirection: "column", 
                    gap: "15px" 
                    }}> 
                    {modal === "ventasFecha" && <InformeVentas />} 
                    {modal === "turnosFecha" && <InformeTurnos />} 
                    {modal === "empleadoMasVentas" && <InformeEmpleadoMasVentas />}
                </div> 
            </div> 
        </div> 
    </Modal> 
</div >);
};