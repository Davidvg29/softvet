import { useState, useEffect } from 'react';
import { historiasClinicas, detalleHistoriasClinicas } from '../../endpoints/endpoints';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import jsPDF from "jspdf";
import logovet from "../../assets/logovet.png"
import { useEmpleadoStore } from '../../zustand/empleado';
import { Card, Button, Row, Col } from "react-bootstrap";
import EditarDetalleHistoriaClinica from './EditarDetalleHistoriaClinica';

const VerHistoriaClinica = ({ id, mostrarDetalles = true }) => {
    const empleado = useEmpleadoStore((state) => state.empleado);
    const rolUsuario = empleado?.nombre_rol || "";

    const [historiaClinica, setHistoriaClinica] = useState(null);
    const [detallesClinicos, setDetallesClinicos] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [fromType, setFromType] = useState("");
    const [detalleIdParaEditar, setDetalleIdParaEditar] = useState(null);

    const TITULOS = {
        editarDetalleHistoriaClinica: "Editar Detalle de Historia Clínica",
    };

    const cargarDetalleHistoriaClinica = async () => {
        if (!id || !mostrarDetalles) return;
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

    const handleOpenModal = (type, detalleId) => {
        setFromType(type);
        setDetalleIdParaEditar(detalleId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFromType("");
        setDetalleIdParaEditar(null);
    };

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

    useEffect(() => {
        cargarDetalleHistoriaClinica();
    }, [id, mostrarDetalles]);

    const handleDetalleActualizado = () => {
        handleCloseModal();
        cargarDetalleHistoriaClinica();
    };

    const imprimirPDF = () => {
  if (!detallesClinicos.length) {
    return Swal.fire("Error", "No hay detalles para imprimir", "error");
  }

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // LOGO
  pdf.addImage(logovet, "PNG", margin, y, 40, 20);

  // TÍTULO
  pdf.setFontSize(18);
  pdf.text("Historia Clínica", pageWidth / 2, y + 10, { align: "center" });

  y += 30;

  // DATOS GENERALES
  pdf.setFontSize(12);
  pdf.text(`Cliente: ${historiaClinica.nombre_cliente}`, margin, y);
  y += 7;
  pdf.text(`Mascota: ${historiaClinica.nombre_mascota}`, margin, y);
  y += 7;

  y += 10;

  // ENCABEZADO
  pdf.setFillColor(111, 66, 193);
  pdf.setTextColor(255, 255, 255);
  pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, "F");

  pdf.text("Fecha", margin + 2, y);
  pdf.text("Veterinario", margin + 50, y);
  pdf.text("Diagnóstico", margin + 100, y);

  pdf.setTextColor(0, 0, 0);
  y += 10;

  // DETALLES
  detallesClinicos.forEach((d) => {

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    // 📅 Fecha
    let fecha = "N/A";
    if (d.fecha_atencion) {
      const partes = d.fecha_atencion.split("T")[0].split("-");
      fecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // 👨‍⚕️ Veterinario
    const vet = d.veterinario_atencion || "Sin asignar";

    // 📝 Diagnóstico
    const diagnostico = pdf.splitTextToSize(
      d.diagnostico_detalle || "N/A",
      80
    );

    pdf.text(fecha, margin + 2, y);
    pdf.text(vet, margin + 50, y);
    pdf.text(diagnostico, margin + 100, y);

    y += 8;
  });

  y += 10;

  // TOTAL
  pdf.setFontSize(14);
  pdf.text(
    `TOTAL ATENCIONES: ${detallesClinicos.length}`,
    pageWidth - margin,
    y,
    { align: "right" }
  );

  // PREVIEW
  const blob = pdf.output("bloburl");
  window.open(blob, "_blank");
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

            {mostrarDetalles && (
                <>
                    <h4 className="text-center mt-5 mb-3" style={{ color: "#6f42c1" }}>
                        Historial de Atenciones ({detallesClinicos.length})
                    </h4>
                    <div className="text-center mb-3">
                        <Button
                            variant="primary"
                            onClick={imprimirPDF}
                        >
                            🖨️ Imprimir Historia
                        </Button>
                    </div>
                    {detallesClinicos && detallesClinicos.length > 0 ? (
                        detallesClinicos.map((detalle, index) => (
                            <Card
                                key={detalle.id_detalle_historia_clinica}
                                className="m-4 p-4 shadow border-info"
                                style={{
                                    backgroundColor: index % 2 === 0 ? "#d1ecff" : "#b48acc",
                                    borderRadius: "10px",
                                    color: "#000000",
                                    borderLeft: "10px solid #9d00ff",
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                            >
                                <Card.Body>
                                    <Row className="mb-2 align-items-center">
                                        <Col>
                                            <Card.Title className="h6 mb-1">
                                                **Atención #**{detalle.id_detalle_historia_clinica}
                                            </Card.Title>
                                        </Col>
                                        <Col className="text-end">
                                            {(rolUsuario === "Administrador" || rolUsuario === "Veterinario") && (
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleOpenModal("editarDetalleHistoriaClinica", detalle.id_detalle_historia_clinica)}
                                                >
                                                    ✏️ Editar Detalle
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>

                                    <hr className="my-2" />

                                    <Card.Text>
                                        <strong>Fecha:</strong> {new Date(detalle.fecha_atencion).toLocaleString("es-AR")}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Veterinario:</strong> {detalle.veterinario_atencion || "No asignado"}
                                    </Card.Text>

                                    <Card.Text className="mt-3">
                                        <strong>Diagnóstico / Observaciones:</strong> {detalle.diagnostico_detalle}
                                    </Card.Text>

                                    {/* --- NUEVA SECCIÓN DE PRODUCTOS --- */}
                                    <div className="mt-3">
                                        <strong>Productos/Servicios:</strong>
                                        {detalle.productos_vendidos && detalle.productos_vendidos.length > 0 ? (
                                            <ul className="mt-2" style={{ listStyleType: "circle" }}>
                                                {detalle.productos_vendidos.map((prod, pIdx) => (
                                                    <li key={pIdx}>
                                                        {prod.producto} - Cantidad: {prod.cantidad}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted ms-2 italic">Sin productos registrados</span>
                                        )}
                                    </div>
                                    {/* ---------------------------------- */}

                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted">Aún no hay detalles de atención.</p>
                    )}

                    <Modal
  key={fromType}
  show={showModal}
  onHide={handleCloseModal}
  centered
  backdrop="static"
  contentClassName="bg-transparent border-0 shadow-none"
  dialogClassName="bg-transparent"
  style={{ "--bs-modal-width": "850px" }} // 👈 balance ideal
>
  <div
    style={{
      maxWidth: "850px",
      width: "100%",
      margin: "auto",

      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.9)",
      borderRadius: "18px",
      padding: "22px",
      position: "relative",

      border: "2px solid #6f42c1",
      boxShadow: "0 20px 60px rgba(111,66,193,0.25)",
      animation: "modalFade 0.3s ease",
    }}
  >
    {/* Glow */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "22px",
        boxShadow: "0 0 40px rgba(111,66,193,0.25)",
        pointerEvents: "none",
      }}
    />

    {/* Cerrar */}
    <button
      onClick={handleCloseModal}
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
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          marginBottom: "10px",
          color: "#fff",
          fontSize: "22px",
          boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
        }}
      >
        <i className="bi-pencil-square"></i>
      </div>

      <h3
        style={{
          fontWeight: "700",
          color: "#6f42c1",
          marginBottom: "4px",
        }}
      >
        {TITULOS[fromType]}
      </h3>

      <div
        style={{
          width: "70px",
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
        padding: "24px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        maxHeight: "70vh", 
        overflowY: "auto", 
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {fromType === "editarDetalleHistoriaClinica" && (
          <EditarDetalleHistoriaClinica
            id={detalleIdParaEditar}
            onClose={handleCloseModal}
            onUpdated={handleDetalleActualizado}
          />
        )}
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
                </>
            )}
        </>
    );
};

export default VerHistoriaClinica;