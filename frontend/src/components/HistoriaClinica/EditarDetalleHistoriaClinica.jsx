import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useEmpleadoStore } from "../../zustand/empleado";
import { detalleHistoriasClinicas } from "../../endpoints/endpoints";


const formatFecha = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return 'Fecha inválida';
  }
};

const EditarDetalleHistoriaClinica = ({ id, onClose, onUpdated }) => {

  
  const [detalle, setDetalle] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(true);

  
  const empleado = useEmpleadoStore((state) => state.empleado);
  const idEmpleadoLogueado = empleado?.id_empleado;
  const nombreVeterinarioLogueado = empleado?.nombre_empleado || "N/A";

  
  const [nombreEmpleadoRegistro, setNombreEmpleadoRegistro] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [idHC, setIdHC] = useState(null); 

 
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const cargarDetalle = async () => {
      try {
        const response = await axios.get(`${detalleHistoriasClinicas}/verDetalle/${id}`, { withCredentials: true });
        const data = Array.isArray(response.data) && response.data.length > 0
          ? response.data[0]
          : response.data;

        if (!data) {
          throw new Error("Respuesta de detalle vacío.");
        }
        setDetalle(data);
        setObservaciones(data.observaciones || "");

        
        setNombreEmpleadoRegistro(data.nombre_empleado || "Empleado Desconocido");
        setFechaRegistro(data.fecha_hora);

        // ID de HC solo para mostrar
        setIdHC(data.id_historia_clinica || null);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar detalle clínico:", error.response?.data || error);
        Swal.fire("Error", "No se pudo cargar la información del detalle.", "error");
        setLoading(false);
      }
    };
    cargarDetalle();
  }, [id]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!observaciones.trim()) {
      return Swal.fire("Advertencia", "Las observaciones del diagnóstico no pueden estar vacías.", "warning");
    }

  
    if (!idEmpleadoLogueado) {
      return Swal.fire("Error", "No se encontró el ID del empleado logueado. Inicie sesión nuevamente.", "error");
    }

    
    const detalleData = {
      id_empleado: idEmpleadoLogueado, 
      observaciones: observaciones,
    };

    try {
      await axios.put(
        `${detalleHistoriasClinicas}/editar/${id}`,
        detalleData,
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Detalle clínico modificado. El empleado de registro y la fecha se han actualizado.",
        showConfirmButton: false,
        timer: 2500
      });

      onUpdated();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Hubo un problema desconocido al actualizar.";
      console.error("Error al actualizar detalle clínico:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Error al Actualizar",
        text: errorMessage
      });
    }
  };

  if (!id || !detalle) {
    
  }

  

  return (
    <div style={{ padding: "10px", color: "#000" }}>
      <h5 className="text-center mb-4">
        **Editar Detalle** (HC: {idHC} / Detalle: {id})
      </h5>

      <Form onSubmit={handleSubmit} className="px-3">

        {/* Fila de Datos de Registro (Solo Lectura) */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Fecha de Registro Original:</Form.Label>
              <Form.Control
                type="text"
                value={formatFecha(fechaRegistro)}
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Veterinario (Registro Original):</Form.Label>
              <Form.Control
                type="text"
                value={nombreEmpleadoRegistro}
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="text-primary mb-3 text-center">
          **AVISO**: Al guardar, la fecha y el veterinario se actualizarán a **{nombreVeterinarioLogueado}** y la hora actual.
        </div>
        <hr className="my-3" />

        {/* Observaciones / Diagnóstico */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4" className="text-end fw-bold">Observaciones/Diagnóstico:</Form.Label>
          <Col sm="8">
            <Form.Control
              as="textarea"
              rows={6}
              name="observaciones"
              placeholder="Detalle de la consulta, diagnóstico y tratamiento..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              style={{ resize: "none" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
            />
          </Col>
        </Form.Group>

        {/* Botones */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <Button type="submit" 
          style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
            }}
          >
            Actualizar Detalle
          </Button>
          <Button
            onClick={onClose}
            style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditarDetalleHistoriaClinica;