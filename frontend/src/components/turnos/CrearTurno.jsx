import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useEmpleadoStore } from "../../zustand/empleado";
import validationCrearTurnos from "../../validations/validationCrearTurnos";
import { TURNOS, clientes, mascotas } from "../../endpoints/endpoints";
import Swal from "sweetalert2";

const CrearTurno = ({ onClose, onUpdate }) => {
    const empleado = useEmpleadoStore((state) => state.empleado);
    const nombreVeterinario = empleado?.nombre_empleado || "";
    const rolUsuario = empleado?.nombre_rol || "";

    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [clientesEncontrados, setClientesEncontrados] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [mascotasCliente, setMascotasCliente] = useState([]);
    const [fecha, setFecha] = useState("");
    const [horario, setHorario] = useState("");
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);

    const [turno, setTurno] = useState({
        motivo_turno: "",
        id_cliente: "",
        id_mascota: "",
        id_empleado: empleado?.id_empleado
    });

    // Validación de roles
    useEffect(() => {
        if (rolUsuario !== "Veterinario" && rolUsuario !== "Administrador") {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "Solo los usuarios con rol 'veterinario' pueden crear turnos.",
                showConfirmButton: true,
            }).then(() => {
                onClose();
            });
        }
    }, [rolUsuario, onClose]);

    // Set empleado en el turno
    useEffect(() => {
        if (empleado?.id_empleado) {
            setTurno(prev => ({ ...prev, id_empleado: empleado.id_empleado }));
        }
    }, [empleado]);

    // Buscar clientes
    const buscarCliente = async (texto) => {
        setBusquedaCliente(texto);
        if (texto.trim().length < 2) {
            setClientesEncontrados([]);
            return;
        }
        try {
            const res = await axios.get(`${clientes}/buscar?query=${texto}`, { withCredentials: true });
            setClientesEncontrados(res.data);
        } catch (error) {
            console.error("Error buscando cliente:", error);
        }
    };

    // Seleccionar cliente y cargar mascotas
    const seleccionarCliente = async (cliente) => {
        setClienteSeleccionado(cliente);
        setBusquedaCliente(cliente.nombre_cliente);
        setClientesEncontrados([]);
        setTurno(prev => ({ ...prev, id_cliente: cliente.id_cliente }));

        try {
            const res = await axios.get(`${mascotas}/cliente/${cliente.id_cliente}`, { withCredentials: true });
            setMascotasCliente(res.data);
        } catch (error) {
            console.error("Error cargando mascotas:", error);
        }
    };

    // Buscar horarios disponibles según fecha
    const buscarHorarios = async (fechaSeleccionada) => {
        setFecha(fechaSeleccionada);
        setHorario(""); // resetear horario seleccionado

        if (!fechaSeleccionada) {
            setHorariosDisponibles([]);
            return;
        }

        try {
            const res = await axios.get(`${TURNOS}/horariosDisponibles`, {
                params: { fecha: fechaSeleccionada },
                withCredentials: true
            });
            setHorariosDisponibles(res.data);
        } catch (error) {
            console.error("Error cargando horarios:", error);
        }
    };

    const handleChange = (e) => {
        setTurno({ ...turno, [e.target.name]: e.target.value });
    };

    const ejecutarCreacionTurno = async (fecha_hora) => {
        try {
            const nuevoTurno = { ...turno, fecha_hora };

            await axios.post(`${TURNOS}/crear`, nuevoTurno, { withCredentials: true });

            Swal.fire({
                icon: "success",
                title: "Turno creado",
                text: "El turno ha sido creado correctamente.",
                showConfirmButton: false,
                timer: 2000
            });

            // Resetear formulario
            setTurno({ motivo_turno: "", id_cliente: "", id_mascota: "", id_empleado: empleado?.id_empleado });
            setClienteSeleccionado(null);
            setMascotasCliente([]);
            setBusquedaCliente("");
            setFecha("");
            setHorario("");
            setHorariosDisponibles([]);

            onUpdate();
            onClose();

        } catch (error) {
            console.error("Error al crear turno:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "Hubo un problema al crear el turno."
            });
        }
    };

    const handleConfirmAndSubmit = async (e) => {
        e.preventDefault();

        const fecha_hora = fecha && horario ? `${fecha} ${horario}` : "";

        const dataValidar = {
            ...turno,
            fecha,
            horario,
            fecha_hora
        };

        const validation = validationCrearTurnos(dataValidar);

        if (validation.length !== 0) {
            return Swal.fire({
                icon: "warning",
                title: "Validación",
                text: validation,
                confirmButtonText: "Entendido"
            });
        }

        const result = await Swal.fire({
            title: "¿Desea crear el turno?",
            text: `Se creará el turno para ${clienteSeleccionado.nombre_cliente}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, crear",
            cancelButtonText: "No, cancelar"
        });

        if (result.isConfirmed) {
            ejecutarCreacionTurno(fecha_hora);
        }
    };

    return (
        <div style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
            <h3 className="text-center mb-4">Crear Turno</h3>

            <Form className="px-5" onSubmit={handleConfirmAndSubmit}>
                {/* Veterinario */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm="3" className="text-end fw-bold">Veterinario:</Form.Label>
                    <Col sm="9">
                        <Form.Control type="text" value={nombreVeterinario} readOnly disabled style={{ backgroundColor: '#e9ecef' }} />
                    </Col>
                </Form.Group>

                {/* Cliente */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm="3" className="text-end fw-bold">Cliente:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre o DNI"
                            value={busquedaCliente}
                            onChange={(e) => buscarCliente(e.target.value)}
                        />
                        {clientesEncontrados.length > 0 && (
                            <div className="border mt-1 p-2 bg-white">
                                {clientesEncontrados.map(c => (
                                    <div key={c.id_cliente} onClick={() => seleccionarCliente(c)} style={{ cursor: "pointer", padding: "5px" }}>
                                        {c.nombre_cliente} — DNI: {c.dni_cliente}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Col>
                </Form.Group>

                {/* Mascota */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm="3" className="text-end fw-bold">Mascota:</Form.Label>
                    <Col sm="9">
                        <Form.Select
                            name="id_mascota"
                            value={turno.id_mascota}
                            onChange={handleChange}
                            disabled={!clienteSeleccionado}
                        >
                            <option value="">Seleccione una mascota</option>
                            {mascotasCliente.map(m => (
                                <option key={m.id_mascota} value={m.id_mascota}>
                                    {m.nombre_mascota} {m.tieneHistoria ? "(ya tiene historia)" : ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* Motivo */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm="3" className="text-end fw-bold">Motivo:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="text"
                            name="motivo_turno"
                            placeholder="Ej: Vacunación, control general..."
                            value={turno.motivo_turno}
                            onChange={handleChange}
                            disabled={!clienteSeleccionado}
                        />
                    </Col>
                </Form.Group>

                {/* Fecha */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm="3" className="text-end fw-bold">Fecha:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="date"
                            value={fecha}
                            onChange={(e) => buscarHorarios(e.target.value)}
                            disabled={!clienteSeleccionado}
                        />
                    </Col>
                </Form.Group>

                {/* Horario */}
                {horariosDisponibles.length > 0 && (
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label column sm="3" className="text-end fw-bold">Horario:</Form.Label>
                        <Col sm="9">
                            <Form.Select value={horario} onChange={(e) => setHorario(e.target.value)}>
                                <option value="">Seleccione un horario</option>
                                {horariosDisponibles.map((h, i) => (
                                    <option key={i} value={h}>{h}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                )}

                {/* Botones */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button type="submit" style={{ backgroundColor: "#5a7edc", border: "none" }}>Guardar</Button>
                    <Button style={{ backgroundColor: "#e74c3c", border: "none", marginLeft: "10px" }} onClick={onClose}>Cancelar</Button>
                </div>
            </Form>
        </div>
    );
};

export default CrearTurno;
