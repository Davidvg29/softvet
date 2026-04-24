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
            <Modal
  show={modal !== null}
  onHide={cerrar}
  centered
  backdrop="static"
  contentClassName="bg-transparent border-0 shadow-none"
  dialogClassName="bg-transparent"
  style={{ "--bs-modal-width": "1000px" }} // 👈 más ancho
>
  <div
    style={{
      maxWidth: "1000px",
      width: "100%",
      margin: "auto",

      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.92)",
      borderRadius: "20px",
      padding: "24px",
      position: "relative",

      border: "2px solid #6f42c1",
      boxShadow: "0 25px 70px rgba(111,66,193,0.25)",
      animation: "modalFade 0.3s ease",
    }}
  >
    {/* Glow */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "24px",
        boxShadow: "0 0 50px rgba(111,66,193,0.25)",
        pointerEvents: "none",
      }}
    />

    {/* Cerrar */}
    <button
      onClick={cerrar}
      style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        border: "none",
        background: "#f3f0ff",
        color: "#6f42c1",
        fontSize: "18px",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.target.style.background = "#e0d7ff")}
      onMouseLeave={(e) => (e.target.style.background = "#f3f0ff")}
    >
      ✕
    </button>

    {/* HEADER */}
    <div style={{ textAlign: "center", marginBottom: "25px" }}>
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          marginBottom: "10px",
          color: "#fff",
          fontSize: "24px",
          boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
        }}
      >
        <i className="bi-bar-chart-line"></i>
      </div>

      <h3
        style={{
          fontWeight: "700",
          color: "#6f42c1",
          marginBottom: "4px",
        }}
      >
        {modal === "ventasFecha" && "Informe de Ventas"}
        {modal === "turnosFecha" && "Informe de Turnos"}
        {modal === "empleadoMasVentas" && "Empleado con Más Ventas"}
      </h3>

      <div
        style={{
          width: "80px",
          height: "4px",
          background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
          margin: "10px auto 0",
          borderRadius: "10px",
        }}
      />
    </div>

    {/* CONTENIDO */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        maxHeight: "75vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {modal === "ventasFecha" && <InformeVentas />}
        {modal === "turnosFecha" && <InformeTurnos />}
        {modal === "empleadoMasVentas" && <InformeEmpleadoMasVentas />}
      </div>
    </div>
  </div>

  {/* Animación */}
  <style>
    {`
      @keyframes modalFade {
        from {
          opacity: 0;
          transform: scale(0.94) translateY(15px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `}
  </style>
</Modal>
</div >);
};