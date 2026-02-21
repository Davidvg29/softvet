import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useEmpleadoStore } from "../../zustand/empleado";
import validationCrearHistoriaClinicas from "../../validations/validationCrearHistoriaClinicas";
import { historiasClinicas, clientes, mascotas } from "../../endpoints/endpoints";
import Swal from "sweetalert2";

const EditarHistoriaClinica = ({ id, onClose, onUpdated }) => {
  const empleado = useEmpleadoStore((state) => state.empleado);

  const nombreVeterinario = empleado?.nombre_empleado || "";
  const rolUsuario = empleado?.nombre_rol || "";

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mascotasCliente, setMascotasCliente] = useState([]);

  const [historiaClinica, setHistoriaClinica] = useState({
    observaciones_generales: "",
    id_cliente: "",
    id_mascota: "",
    veterinario: nombreVeterinario
  });

  // CARGAR DATOS DE HC POR ID
 
  useEffect(() => {
    if (!id) return;

    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${historiasClinicas}/ver/${id}`, { withCredentials: true });
        const data = res.data;

        setHistoriaClinica({
          observaciones_generales: data.observaciones_generales,
          id_cliente: data.id_cliente,
          id_mascota: data.id_mascota,
          veterinario: data.veterinario
        });

        setClienteSeleccionado({
          id_cliente: data.id_cliente,
          nombre_cliente: data.nombre_cliente
        });

        setBusquedaCliente(data.nombre_cliente);

        // Cargar mascotas del cliente
        const masc = await axios.get(`${mascotas}/cliente/${data.id_cliente}`);
        setMascotasCliente(masc.data);

      } catch (e) {
        console.error("Error cargando HC", e);
      }
    };

    cargarDatos();
  }, [id]);

  
  // CONTROLAR PERMISOS
 
  useEffect(() => {
    if (rolUsuario !== "Veterinario" && rolUsuario !== "") {
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: "Solo los usuarios con rol 'veterinario' pueden editar historias clínicas.",
        showConfirmButton: true,
      }).then(() => onClose());
    }
  }, [rolUsuario, onClose]);

  const handleChange = (e) => {
    setHistoriaClinica({
      ...historiaClinica,
      [e.target.name]: e.target.value
    });
  };

  
  // FUNCIÓN PRINCIPAL PARA EDITAR HC
 
  const ejecutarEdicion = async () => {
    try {
      const response = await axios.put(
        `${historiasClinicas}/editar/${id}`,
        historiaClinica,
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Historia Clínica Editada!",
        text: "Los datos se actualizaron correctamente.",
        timer: 2500
      });

      onUpdated();
      onClose();

    } catch (error) {
      console.error("Error al editar historia clínica:", error);

      Swal.fire({
        icon: "error",
        title: "Error al Editar",
        text: "Ocurrió un problema al guardar los cambios."
      });
    }
  };

 
  // HANDLER SUBMIT CON CONFIRMACIÓN
  
  const handleConfirmAndSubmit = async (e) => {
    e.preventDefault();

    const validation = validationCrearHistoriaClinicas(historiaClinica);
    if (validation.length !== 0) {
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: validation,
        confirmButtonText: "Entendido"
      });
    }

    const result = await Swal.fire({
      title: "¿Editar Historia Clínica?",
      text: `Cliente: ${clienteSeleccionado?.nombre_cliente}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) ejecutarEdicion();
  };


  return (
    <div
      style={{
        backgroundColor: "#cfcfcf",
        borderRadius: "10px",
        padding: "25px 40px",
        color: "#000"
      }}
    >
      <h3 className="text-center mb-4">Editar Historia Clínica</h3>

      <Form className="px-5" onSubmit={handleConfirmAndSubmit}>

        {/* Veterinario */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Veterinario:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              value={historiaClinica.veterinario}
              readOnly
              disabled
              style={{ backgroundColor: '#e9ecef' }}
            />
          </Col>
        </Form.Group>

        {/* CLIENTE */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Cliente:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              value={busquedaCliente}
              disabled
            />
          </Col>
        </Form.Group>

        {/* MASCOTA */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Mascota:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              name="id_mascota"
              value={historiaClinica.id_mascota}
              disabled
            >
              <option value="">Seleccione una mascota</option>
              {mascotasCliente.map((m) => (
                <option key={m.id_mascota} value={m.id_mascota}>
                  {m.nombre_mascota} ({m.sexo_mascota})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* OBSERVACIONES GENERALES */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Observación General:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              name="observaciones_generales"
              placeholder="Detalle general"
              value={historiaClinica.observaciones_generales}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* BOTONES */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="submit" style={{ backgroundColor: "#5a7edc", border: "none" }}>
            Guardar Cambios
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

export default EditarHistoriaClinica;
