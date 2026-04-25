import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { clientes } from '../../endpoints/endpoints';
import CrearCliente from './CrearCliente';
import VerCliente from './VerCliente';
import EditCliente from './EditCliente';
import CrearMascota from '../mascotas/CrearMascota';
import { useEmpleadoStore } from '../../zustand/empleado';

const MainCliente = () => {
  const [cliente, setCliente] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');
  const [filtroActivo, setFiltroActivo] = useState("todos");

  // Paginación manejada por backend
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const elementosPorPagina = 5;

  const empleadoStore = useEmpleadoStore((state) => state.empleado);
  const rolUsuario = empleadoStore?.nombre_rol || "";

  const TITULOS = {
    crear: 'Nuevo Cliente',
    ver: 'Ver Cliente',
    editar: 'Editar Cliente',
    agregarMascota: 'Agregar Mascota'
  };

  const cargarClientes = async () => {
    try {
      const response = await axios.get(`${clientes}/ver`, {
        withCredentials: true,
        params: {
          page: paginaActual,
          limit: elementosPorPagina,
          search: busqueda,
          // Si no es admin, forzamos que solo traiga activos al backend
          estado: rolUsuario === "Administrador" ? filtroActivo : "activos"
        }
      });
      setCliente(response.data.data);
      setTotalPaginas(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error al cargar los Clientes:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      cargarClientes();
    }, 150); // Un pequeño delay para no saturar al escribir
    return () => clearTimeout(delayDebounceFn);
  }, [paginaActual, busqueda, filtroActivo]);

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setClienteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFromType('');
  };

  const borrarClientes = async (id) => {
    if (rolUsuario !== "Administrador") {
      Swal.fire({ icon: "error", title: "Acceso Denegado", text: "Solo el Administrador puede dar de baja clientes.", confirmButtonColor: "#6f42c1" });
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Dar de baja Cliente?',
      text: 'El cliente será desactivado del sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.delete(`${clientes}/eliminar/${id}/${empleadoStore.id_empleado}`, { withCredentials: true });
      if (response.status === 200) {
        await Swal.fire({ icon: 'success', title: 'Cliente desactivado', confirmButtonColor: '#6f42c1' });
        cargarClientes();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo procesar la baja.', confirmButtonColor: '#6f42c1' });
    }
  };

  const activarClienteFront = async (id) => {
    if (rolUsuario !== "Administrador") {
      Swal.fire({ icon: "error", title: "Acceso Denegado", text: "No tienes permisos para esta acción.", confirmButtonColor: "#6f42c1" });
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Activar Cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.put(`${clientes}/activar/${id}`, { id_empleado: empleadoStore.id_empleado }, { withCredentials: true });
      if (response.status === 200) {
        await Swal.fire({ icon: 'success', title: 'Activado correctamente', confirmButtonColor: '#6f42c1' });
        cargarClientes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const botonPaginacionStyle = {
    backgroundColor: "#6f42c1",
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 4px 0 #59359a",
    transition: "all 0.1s ease",
    padding: "8px 20px",
    borderRadius: "10px"
  };

  return (
    <>
      <div className="text-center">
        <h1 className="fw-bold animate-title p-2 mb-2 d-inline-block" style={{ background: "linear-gradient(90deg, #6f42c1, #8f41aeff)", fontSize: "2.5rem", color: "#fff", marginTop: "10px", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "12px" }}>
          <i className="bi bi-people-fill" style={{ marginRight: "8px" }}></i>
          CLIENTES
        </h1>
      </div>

      <style>{`.animate-title { opacity: 0; transform: translateY(10px); animation: fadeSlide 0.6s ease-out forwards; } @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">

        {rolUsuario === "Administrador" && (
          <div className="d-flex gap-2 mt-3">
            {["todos", "activos", "inactivos"].map((key) => (
              <span key={key} onClick={() => { setFiltroActivo(key); setPaginaActual(1); }} style={{ padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", background: filtroActivo === key ? "#6f42c1" : "#f1f1f1", color: filtroActivo === key ? "#fff" : "#555", transition: "0.2s" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center m-3 w-75">
          <Form.Control type="text" placeholder="Buscar por nombre o DNI de Cliente" className="w-50 mx-3" value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }} />
          <Button onClick={() => handleOpenModal('crear')} style={{ backgroundColor: "#6f42c1", border: "none", fontWeight: "bold", color: "#fff", boxShadow: "0 4px 0 #6f42c1", transition: "all 0.1s ease" }}>
            Crear un nuevo Cliente
          </Button>
        </div>

        <div style={{ border: "3px solid #6f42c1", borderRadius: "16px", padding: "25px", backgroundColor: "#f8f9fa", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", width: "85%", maxWidth: "950px", marginTop: "30px" }}>
          <Table hover responsive style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #6f42c1, #9b59b6)", color: "#fff", textAlign: "center", fontSize: "18px" }}>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>N°</th>
                <th style={{ padding: "14px" }}>Nombre Cliente</th>
                <th style={{ padding: "14px" }}>Dni Cliente</th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cliente.length > 0 ? (
                cliente.map((item) => (
                  <tr key={item.id_cliente} style={{ backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{item.id_cliente}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{item.nombre_cliente}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{item.dni_cliente}</td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        border: "none",
                      }}
                    >
                      {/* VER */}
                      <Button
                        style={{
                          backgroundColor: "#1ab637",
                          border: "none",
                          fontWeight: "bold",
                          color: "#fff",
                          boxShadow: "0 3px 0 #138a28",
                          transition: "all 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #138a28";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 3px 0 #138a28";
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translateY(2px)";
                          e.target.style.boxShadow = "0 2px 0 #138a28";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #138a28";
                        }}
                        onClick={() => handleOpenModal("ver", item.id_cliente)}
                      >
                        Ver
                      </Button>

                      {/* EDITAR */}
                      <Button
                        style={{
                          backgroundColor: "#ffc107",
                          border: "none",
                          fontWeight: "bold",
                          color: "#333",
                          boxShadow: "0 3px 0 #d39e00",
                          transition: "all 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #d39e00";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 3px 0 #d39e00";
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translateY(2px)";
                          e.target.style.boxShadow = "0 2px 0 #d39e00";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #d39e00";
                        }}
                        onClick={() => handleOpenModal("editar", item.id_cliente)}
                      >
                        Editar
                      </Button>

                      {/* + MASCOTA */}
                      <Button
                        style={{
                          backgroundColor: "#606fe4",
                          border: "none",
                          fontWeight: "bold",
                          color: "#fff",
                          boxShadow: "0 3px 0 #4857cd",
                          transition: "all 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #4857cd";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 3px 0 #4857cd";
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translateY(2px)";
                          e.target.style.boxShadow = "0 2px 0 #4857cd";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 5px 0 #4857cd";
                        }}
                        onClick={() => handleOpenModal("agregarMascota", item.id_cliente)}
                      >
                        + Mascota
                      </Button>

                      {/* BAJA / ACTIVAR */}
                      {item.is_active ? (
                        <Button
                          style={{
                            backgroundColor: "#dc3545",
                            border: "none",
                            fontWeight: "bold",
                            color: "#fff",
                            boxShadow: "0 3px 0 #a71d2a",
                            transition: "all 0.1s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 5px 0 #a71d2a";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 3px 0 #a71d2a";
                          }}
                          onMouseDown={(e) => {
                            e.target.style.transform = "translateY(2px)";
                            e.target.style.boxShadow = "0 2px 0 #a71d2a";
                          }}
                          onMouseUp={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 5px 0 #a71d2a";
                          }}
                          onClick={() => borrarClientes(item.id_cliente)}
                        >
                          Dar Baja
                        </Button>
                      ) : (
                        rolUsuario === "Administrador" && (
                          <Button
                            style={{
                              backgroundColor: "#e8e8e8",
                              border: "none",
                              fontWeight: "bold",
                              color: "#040404",
                              boxShadow: "0 3px 0 #28a745",
                              transition: "all 0.1s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow = "0 5px 0 #28a745";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "0 3px 0 #28a745";
                            }}
                            onMouseDown={(e) => {
                              e.target.style.transform = "translateY(2px)";
                              e.target.style.boxShadow = "0 2px 0 #28a745";
                            }}
                            onMouseUp={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow = "0 5px 0 #28a745";
                            }}
                            onClick={() => activarClienteFront(item.id_cliente)}
                          >
                            Activar
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-4">No se encontraron Clientes.</td></tr>
              )}
            </tbody>
          </Table>

          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Button style={botonPaginacionStyle} disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</Button>
              <span className="mx-4 fw-bold" style={{ color: "#6f42c1" }}>Página {paginaActual} de {totalPaginas}</span>
              <Button style={botonPaginacionStyle} disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</Button>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static" contentClassName="bg-transparent border-0 shadow-none" style={{ "--bs-modal-width": "800px" }}>
        <div style={{ maxWidth: "800px", width: "100%", background: "rgba(255,255,255,0.95)", borderRadius: "18px", padding: "22px", position: "relative", border: "2px solid #6f42c1", boxShadow: "0 20px 60px rgba(111,66,193,0.25)", backdropFilter: "blur(10px)" }}>
          <button onClick={handleCloseModal} style={{ position: "absolute", top: "14px", right: "14px", width: "35px", height: "35px", borderRadius: "50%", border: "none", background: "#f3f0ff", color: "#6f42c1" }}>✕</button>
          <div className="text-center mb-4">
            <h3 style={{ fontWeight: "700", color: "#6f42c1" }}>{TITULOS[fromType]}</h3>
            <div style={{ width: "60px", height: "4px", background: "linear-gradient(90deg, #6f42c1, #9b59b6)", margin: "8px auto", borderRadius: "10px" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: "15px", padding: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            {fromType === "crear" && <CrearCliente onClose={handleCloseModal} onUpdate={cargarClientes} />}
            {fromType === "ver" && <VerCliente id_cliente={clienteId} />}
            {fromType === "editar" && <EditCliente id_cliente={clienteId} onClose={handleCloseModal} onUpdate={cargarClientes} />}
            {fromType === "agregarMascota" && <CrearMascota id_cliente={clienteId} onClose={handleCloseModal} onUpdate={cargarClientes} />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainCliente;