import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useEmpleadoStore } from "../../zustand/empleado";
import { detalleHistoriasClinicas } from "../../endpoints/endpoints";


const DetalleHistoriaClinica = ({ idHistoriaClinica, onClose, onUpdated }) => {
  // Obtener datos del empleado logueado para id_empleado
  const empleado = useEmpleadoStore((state) => state.empleado);
  const idEmpleado = empleado?.id_empleado;
  const nombreVeterinario = empleado?.nombre_empleado || "N/A";
  
  // Estado para capturar la observación del detalle
  const [observaciones, setObservaciones] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!observaciones.trim()) {
      return Swal.fire("Advertencia", "Las observaciones del diagnóstico no pueden estar vacías.", "warning");
    }
    if (!idEmpleado) {
        return Swal.fire("Error", "No se pudo identificar al veterinario. Intente de nuevo.", "error");
    }

    const detalleData = {
        id_historia_clinica: idHistoriaClinica, // ID de la HC que recibimos por props
        observaciones: observaciones, // El diagnóstico/tratamiento
        id_empleado: idEmpleado, // ID del veterinario logueado
        // Nota: Si tu backend requiere id_sucursal, agrégalo aquí también.
    };
    
    try {
      const response = await axios.post(
        `${detalleHistoriasClinicas}/crear`, 
        detalleData,
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Detalle clínico agregado correctamente.",
        showConfirmButton: false,
        timer: 2500
      });

      if (response) {
        onUpdated(); // Refrescar el Main (para que se actualice la vista)
        onClose();
      }
    } catch (error) {
      console.error("Error al crear detalle clínico:", error);
      Swal.fire({
        icon: "error",
        title: "Error al Guardar",
        text: "Hubo un problema al intentar agregar el detalle clínico."
      });
    }
  };

  // Restricción de seguridad
  if (!idHistoriaClinica) {
    return <p className="text-danger p-3">Error: No se ha proporcionado un ID de Historia Clínica para asociar el detalle.</p>;
  }

  return (
    <div style={{ padding: "10px", color: "#000" }}>
      <h5 className="text-center mb-4">Agregar Detalle a HC ID: {idHistoriaClinica}</h5>
      <Form onSubmit={handleSubmit} className="px-3">
        
        {/* Veterinario (Solo Lectura) */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="4" className="text-end fw-bold">Veterinario:</Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              value={nombreVeterinario}
              readOnly
              style={{ backgroundColor: '#e9ecef' }}
            />
          </Col>
        </Form.Group>

        {/* Observaciones / Diagnóstico */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4" className="text-end fw-bold">Observaciones/Diagnóstico:</Form.Label>
          <Col sm="8">
            <Form.Control
              as="textarea"
              rows={4}
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
            Guardar Detalle
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

export default DetalleHistoriaClinica;