import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useEmpleadoStore } from "../../zustand/empleado";
import { detalleHistoriasClinicas } from "../../endpoints/endpoints";
import CrearVenta from "../Ventas/CrearVenta";


const DetalleHistoriaClinica = ({ idHistoriaClinica, onClose, onUpdated }) => {
  // Obtener datos del empleado logueado para id_empleado
  const empleado = useEmpleadoStore((state) => state.empleado);
  const idEmpleado = empleado?.id_empleado;
  const nombreVeterinario = empleado?.nombre_empleado || "N/A";
  const [mostrarCrearVenta, setMostrarCrearVenta] = useState(false);
  const [idVentaGenerada, setIdVentaGenerada] = useState(null);
  
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
        id_historia_clinica: idHistoriaClinica, 
        observaciones: observaciones,
        id_empleado: idEmpleado,
        id_sucursal: empleado?.id_sucursal || null, 
        id_venta: idVentaGenerada 
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
        onUpdated(); 
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

  const handleMostrarCrearVenta = () => {
    setMostrarCrearVenta(true);
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
              style={{ borderRadius: "8px" }}
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
          <Button
           onClick={handleMostrarCrearVenta} 
           style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #31b65b, #6da47e)",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(20, 237, 31, 0.4)",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(20, 237, 31, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(20, 237, 31, 0.4)";
            }}
          >
            Generar Venta
          </Button>

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
            Guardar Detalle
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
      {mostrarCrearVenta && (
  <CrearVenta
    onClose={() => setMostrarCrearVenta(false)}
    onUpdate={(idVenta) => {
      setIdVentaGenerada(idVenta);
      setMostrarCrearVenta(false);
    }}
  />
)}
    </div>
  );
};

export default DetalleHistoriaClinica;