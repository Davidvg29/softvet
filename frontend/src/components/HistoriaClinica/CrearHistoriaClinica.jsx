import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useEmpleadoStore } from "../../zustand/empleado";
import validationCrearHistoriaClinicas from "../../validations/validationCrearHistoriaClinicas";
import { historiasClinicas, clientes, mascotas } from "../../endpoints/endpoints";
import Swal from "sweetalert2";

const CrearHistoriaClinica = ({ onClose, onUpdated }) => {


  const empleado = useEmpleadoStore((state) => state.empleado);


  const nombreVeterinario = empleado?.nombre_empleado || "";
  const rolUsuario = empleado?.nombre_rol || "";


  useEffect(() => {
    if (rolUsuario !== "Veterinario" && rolUsuario !== "Administrador") {
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: "Solo los usuarios con rol 'veterinario' pueden crear historias clínicas.",
        showConfirmButton: true,
      }).then(() => {
        onClose(); // Cerrar el modal o componente
      });
    }
  }, [rolUsuario, onClose]);

  useEffect(() => {
    if (empleado?.id_empleado) {
      setHistoriaClinica((prev) => ({
        ...prev,
        id_empleado: empleado.id_empleado
      }));
    }
  }, [empleado]);

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mascotasCliente, setMascotasCliente] = useState([]);

  const [historiaClinica, setHistoriaClinica] = useState({
    observaciones_generales: "",
    observaciones: "",
    id_cliente: "",
    id_mascota: "",
    id_empleado: empleado?.id_empleado
  });

  const handleChange = (e) => {
    setHistoriaClinica({
      ...historiaClinica,
      [e.target.name]: e.target.value
    });
  };

  // Buscar clientes por nombre o DNI
  const buscarCliente = async (texto) => {
    setBusquedaCliente(texto);

    if (texto.trim().length < 2) {
      setClientesEncontrados([]);
      return;
    }

    try {
      const response = await axios.get(`${clientes}/buscar?query=${texto}`, {
        withCredentials: true
      });
      setClientesEncontrados(response.data);
    } catch (error) {
      console.error("Error buscando cliente:", error);
    }
  };

  // Seleccionar cliente y cargar mascotas
  const seleccionarCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(cliente.nombre_cliente);
    setClientesEncontrados([]);

    setHistoriaClinica((prev) => ({
      ...prev,
      id_cliente: cliente.id_cliente
    }));

    try {
      const res = await axios.get(`${mascotas}/cliente/${cliente.id_cliente}`, {
        withCredentials: true
      });
      setMascotasCliente(res.data);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
    }
  };




  //Función para ejecutar la creación (antes era el cuerpo de handleSubmit)
  const ejecutarCreacionHistoriaClinica = async () => {
  try {

    // VALIDAR SI LA MASCOTA YA TIENE HISTORIA CLÍNICA
    const resCheck = await axios.get(`${historiasClinicas}/ver`, {
      withCredentials: true
    });

    const historias = resCheck.data;

    const yaTieneHistoria = historias.some(
      (h) => h.id_mascota === Number(historiaClinica.id_mascota)
    );

    if (yaTieneHistoria) {
      return Swal.fire({
        icon: "warning",
        title: "Mascota con historia existente",
        text: "Esta mascota ya tiene una historia clínica asociada. No puede crear otra.",
      });
    }

    // Crear historia clínica (ahora sí)
    const response = await axios.post(
      `${historiasClinicas}/crear`,
      historiaClinica,
      { withCredentials: true }
    );

   
    const resMascotas = await axios.get(`${mascotas}/cliente/${historiaClinica.id_cliente}`, {
      withCredentials: true
    });

    const mascotasClienteActualizadas = resMascotas.data.map((m) => {
      const tieneHistoria = historias.some((h) => h.id_mascota === m.id_mascota);
      return { ...m, tieneHistoria };
    });

    setMascotasCliente(mascotasClienteActualizadas);

    
    console.log("Historia clínica creada", response.data);

    setClienteSeleccionado(null);
    setMascotasCliente([]);
    setBusquedaCliente("");

    setHistoriaClinica({
      observaciones_generales: "",
      observaciones: "",
      id_cliente: "",
      id_mascota: "",
      id_empleado: empleado?.id_empleado
    });

    await Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "La historia clínica ha sido creada correctamente.",
      showConfirmButton: false,
      timer: 2500
    });

    if (response) {
      onUpdated();
      onClose();
    }

  } catch (error) {
    console.error("Error al crear historia clínica:", error);

    Swal.fire({
      icon: "error",
      title: "Error al Guardar",
      text: "Hubo un problema al intentar crear la historia clínica."
    });
  }
};


  const handleConfirmAndSubmit = async (e) => {
    e.preventDefault();

    const validation = validationCrearHistoriaClinicas(historiaClinica);
    if (validation.length !== 0) {
      //  Usar SweetAlert para mostrar las validaciones
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: validation,
        confirmButtonText: "Entendido"
      });
    }

    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: "¿Desea Crear la Historia Clínica?",
      text: `Se creará la historia clínica para el cliente ${clienteSeleccionado.nombre_cliente} y su mascota seleccionada.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear",
      cancelButtonText: "No, cancelar"
    });

    if (result.isConfirmed) {
      // Si el usuario confirma, ejecuta la creación
      ejecutarCreacionHistoriaClinica();
    }

    if (rolUsuario !== "veterinario") {
      // Puedes renderizar un loading screen o simplemente retornar null (ya se manejará en useEffect)
      return null;
    }
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
      <h3 className="text-center mb-4">Crear Historia Clínica</h3>

      {/* Cambiar onSubmit a la nueva función con SweetAlert */}
      <Form className="px-5" onSubmit={handleConfirmAndSubmit}>
        {/* ... (Todo el resto de los campos de formulario: Cliente, Mascota, Obs. General, Diagnóstico) ... */}

        {/* /*  Nuevo campo de solo lectura para el Veterinario */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Veterinario:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              value={nombreVeterinario} // Muestra el nombre del veterinario
              readOnly // Hace que el campo sea de solo lectura
              disabled // Deshabilita la interacción (opcional)
              style={{ backgroundColor: '#e9ecef' }} // Estilo para indicar que es de solo lectura
            />
          </Col>
        </Form.Group>

        {/* BUSCADOR DE CLIENTE */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Cliente:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o DNI"
              value={busquedaCliente}
              onChange={(e) => buscarCliente(e.target.value)}
            />

            {/* RESULTADOS */}
            {clientesEncontrados.length > 0 && (
              <div className="border mt-1 p-2 bg-white">
                {clientesEncontrados.map((c) => (
                  <div
                    key={c.id_cliente}
                    onClick={() => seleccionarCliente(c)}
                    style={{ cursor: "pointer", padding: "5px" }}
                  >
                    {c.nombre_cliente} — DNI: {c.dni_cliente}
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Form.Group>

        {/*  DESPLEGABLE DE MASCOTAS */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Mascota:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              name="id_mascota"
              value={historiaClinica.id_mascota}
              onChange={(e) => {
                const idSeleccionado = Number(e.target.value);

                const mascota = mascotasCliente.find(m => m.id_mascota === idSeleccionado);

                if (mascota?.tieneHistoria) {
                  Swal.fire({
                    icon: "warning",
                    title: "Mascota con historia clínica",
                    text: "Esta mascota ya tiene una historia clínica cargada.",
                  });

                  return; // No permitir selección
                }

                handleChange(e);
              }}
              disabled={!clienteSeleccionado}
            >
              <option value="">Seleccione una mascota</option>
              {mascotasCliente.map((m) => (
                <option
                  key={m.id_mascota}
                  value={m.id_mascota}
                  disabled={m.tieneHistoria}
                >
                  {m.nombre_mascota} {m.tieneHistoria ? "(ya tiene historia)" : ""}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* CAMPOS DE HISTORIA CLÍNICA */}
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
        {/* DIAGNÓSTICO INICIAL */}
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">
            Diagnóstico Inicial:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              name="observaciones"  // <-- ESTE ES EL CAMPO QUE BACKEND ESPERA
              placeholder="Detalle inicial del diagnóstico"
              value={historiaClinica.observaciones}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* BOTONES */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="submit" // Sigue siendo 'submit' para que se active handleConfirmAndSubmit
            style={{ backgroundColor: "#5a7edc", border: "none" }}
          >
            Guardar
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

export default CrearHistoriaClinica;