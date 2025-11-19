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
        console.log("Respuesta Completa del Backend:", response.data);
        const data = Array.isArray(response.data) && response.data.length > 0
          ? response.data[0]
          : response.data;

        if (!data) {
          throw new Error("Respuesta de detalle vacío.");
        }
        console.log("Valor de data.observaciones:", data.observaciones);
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

    console.log("Datos ENVIADOS para UPDATE:", detalleData);

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
            />
          </Col>
        </Form.Group>

        {/* Botones */}
        <div className="text-center mt-4">
          <Button type="submit" style={{ backgroundColor: "#1ab637", border: "none" }}>
            Actualizar Detalle
          </Button>
          <Button
            style={{ backgroundColor: "#e74c3c", border: "none", marginLeft: "10px" }}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditarDetalleHistoriaClinica;