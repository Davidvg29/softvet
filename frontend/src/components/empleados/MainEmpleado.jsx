import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { empleados } from '../../endpoints/endpoints';
import CrearEmpleado from './CrearEmpleado';
import VerEmpleado from './VerEmpleado';
import EditEmpleado from './EditEmpleado';
import { useEmpleadoStore } from '../../zustand/empleado';

const MainEmpleado = () => {
  const [empleado, setEmpleado] = useState([]);
  const [empleadoId, setEmpleadoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');
  const [filtroActivo, setFiltroActivo] = useState("todos");
  // valores: "todos" | "activos" | "inactivos"

  const empleadoCurrent = useEmpleadoStore((state) => state.empleado);

  const TITULOS = {
    crear: 'Nuevo Empleado',
    ver: 'Ver Empleado',
    editar: 'Editar Empleado',
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setEmpleadoId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('cerrar modal');
    setShowModal(false);
    setFromType('');
  };

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(`${empleados}/ver`, { withCredentials: true });
      setEmpleado(response.data.reverse());
    } catch (error) {
      console.error('Error al cargar los empleados:', error);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const borrarEmpleados = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar Empleado?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.delete(`${empleados}/eliminar/${id}`, { data: { id_empleado: empleadoCurrent.id_empleado }, withCredentials: true });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'El empleado ha sido eliminado con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });
        cargarEmpleados();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el empleado. Inténtalo nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6f42c1',
      });
    }
  };

  // ── Paginación y Filtrado ──────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // 1. Filtrado
  const empleadosFiltrados = empleado
    .filter((emp) =>
      emp.nombre_empleado.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((emp) => {
      if (filtroActivo === "activos") return emp.is_active === 1;
      if (filtroActivo === "inactivos") return emp.is_active === 0;
      return true; // todos
    });

  // Resetear a la primera página cuando el usuario busca algo
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroActivo]);

  // 2. Paginación sobre el resultado filtrado
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;

  const empleadosPaginados = empleadosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / elementosPorPagina);

  // Estilo reutilizable para los botones de paginación
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

  // ── Lógica para Activar el Empleado ─────────────────────────────────────────
  const activarEmpleadoFront = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Activar Empleado?',
      text: 'El empleado volverá a estar activo en el sistema.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745', // Verde para indicar acción positiva
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.put(
        `${empleados}/activar/${id}`,
        { id_empleado: empleadoCurrent.id_empleado },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Activado correctamente',
          text: 'El empleado ha sido activado con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarEmpleados(); // Recargamos la tabla
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al activar el empleado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo activar el empleado. Inténtalo nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6f42c1',
      });
    }
  };
  console.log(empleado);

  return (
    <>
      <div className="text-center">
        <h1
          className="fw-bold animate-title p-2 mb-2 d-inline-block"
          style={{
            background: "linear-gradient(90deg, #6f42c1, #8f41aeff)",
            fontSize: "2.5rem",
            color: "#ffffffff",
            marginTop: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            borderRadius: "12px",
          }}
        >
          <i className="bi-person-badge-fill" style={{ marginRight: "8px" }}></i>
          EMPLEADOS
        </h1>
      </div>

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
        `}
      </style>

      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">
        {rolUsuario === "Administrador" && (
          <div className="d-flex gap-2 mt-3">
            {[
              { key: "todos", label: "Todos" },
              { key: "activos", label: "Activos" },
              { key: "inactivos", label: "Inactivos" }
            ].map((item) => (
              <span
                key={item.key}
                onClick={() => setFiltroActivo(item.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  background:
                    filtroActivo === item.key ? "#6f42c1" : "#f1f1f1",
                  color: filtroActivo === item.key ? "#fff" : "#555",
                  transition: "0.2s"
                }}
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center m-3 w-75">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de empleado"
            className="w-50 mx-3"
            style={{ width: '700px' }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button
            onClick={() => handleOpenModal('crear')}
            style={{
              backgroundColor: "#6f42c1",
              border: "none",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #6f42c1",
              transition: "all 0.1s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 0 #6f42c1";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 0 #6f42c1";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(2px)";
              e.target.style.boxShadow = "0 2px 0 #6f42c1";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 0 #6f42c1";
            }}
          >
            Crear un nuevo Empleado
          </Button>
        </div>

        <div
          style={{
            border: "3px solid #6f42c1",
            borderRadius: "16px",
            padding: "25px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "85%",
            maxWidth: "950px",
            marginTop: "30px",
          }}
        >
          <Table
            hover
            responsive
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 12px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "18px",
                  borderRadius: "10px",
                }}
              >
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  N°
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  Nombre Empleado
                </th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {/* CORRECCIÓN 2: Iterar sobre 'empleadosPaginados' en lugar de 'empleadosFiltrados' */}
              {empleadosPaginados.length > 0 ? (
                empleadosPaginados.map((empleado) => (
                  <tr
                    key={empleado.id_empleado}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      transform: "translateY(0)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#333",
                        border: "none",
                      }}
                    >
                      {empleado.id_empleado}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#333",
                        border: "none",
                      }}
                    >
                      {empleado.nombre_empleado}
                    </td>

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
                      {/* Botón VER */}
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
                        onClick={() => handleOpenModal("ver", empleado.id_empleado)}
                      >
                        Ver
                      </Button>

                      {/* Botón EDITAR */}
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
                        onClick={() => handleOpenModal("editar", empleado.id_empleado)}
                      >
                        Editar
                      </Button>

                      {/* Botón ELIMINAR / ACTIVAR */}
                      {empleado.is_active ? (
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
                          onClick={() => borrarEmpleados(empleado.id_empleado)}
                        >
                          Eliminar
                        </Button>
                      ) : (
                        <Button
                          style={{
                            backgroundColor: "#e8e8e8",
                            border: "none",
                            fontWeight: "bold",
                            color: "#040404",
                            boxShadow: "0 3px 0 #de2437",
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
                          onClick={() => activarEmpleadoFront(empleado.id_empleado)}
                        >
                          Activar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Empleados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* ── Controles de Paginación ── */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Button
                style={{ ...botonPaginacionStyle, opacity: paginaActual === 1 ? 0.5 : 1, cursor: paginaActual === 1 ? 'not-allowed' : 'pointer' }}
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </Button>

              <span className="mx-4" style={{ fontWeight: "bold", color: "#6f42c1", fontSize: "1.1rem" }}>
                Página {paginaActual} de {totalPaginas}
              </span>

              <Button
                style={{ ...botonPaginacionStyle, opacity: paginaActual === totalPaginas ? 0.5 : 1, cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer' }}
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        key={fromType}
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        contentClassName="bg-transparent border-0 shadow-none"
        dialogClassName="bg-transparent"
        style={{ "--bs-modal-width": "800px" }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            margin: "auto",

            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "18px",
            padding: "22px",
            position: "relative",

            border: "2px solid #6f42c1",
            boxShadow: "0 20px 60px rgba(111,66,193,0.25)",
          }}
        >
          {/* Glow decorativo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "22px",
              boxShadow: "0 0 40px rgba(111,66,193,0.25)",
              pointerEvents: "none",
            }}
          />

          {/* Botón cerrar */}
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

          {/* HEADER PRO */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
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
              <i className="bi-person-fill"></i>
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
              padding: "28px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {fromType === "crear" && (
                <CrearEmpleado
                  onClose={handleCloseModal}
                  onUpdate={cargarEmpleados}
                />
              )}

              {fromType === "ver" && (
                <VerEmpleado id_empleado={empleadoId} />
              )}

              {fromType === "editar" && (
                <EditEmpleado
                  id_empleado={empleadoId}
                  onClose={handleCloseModal}
                  onUpdate={cargarEmpleados}
                />
              )}
            </div>
          </div>
        </div>

        {/* ANIMACIONES */}
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
  );
};

export default MainEmpleado;