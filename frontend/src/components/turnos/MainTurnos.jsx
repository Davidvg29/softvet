import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { empleados, TURNOS } from '../../endpoints/endpoints';
import VerTurno from './VerTurno';
import CrearTurno from './CrearTurno';
import EditarTurno from './EditarTurno';

const MainTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [turnoId, setTurnoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const TITULOS = {
    crear: 'Nuevo Turno',
    ver: 'Ver Turno',
    editar: 'Editar Turno',
  };

  const obtenerFechaFormateada = (diasRestar = 0) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - diasRestar);

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleFiltroRapido = (dias) => {
    const hoy = obtenerFechaFormateada(0);
    const desde = obtenerFechaFormateada(dias);

    setFechaDesde(desde);
    setFechaHasta(hoy);

    handleBuscarPorFechas(desde, hoy); // 🔥 ejecuta búsqueda automática
  };

  const handleBuscarPorFechas = async (overrideDesde = null, overrideHasta = null) => {
    const fDesde = overrideDesde || fechaDesde;
    const fHasta = overrideHasta || fechaHasta;

    if (!fDesde || !fHasta) {
      Swal.fire("Error", "Seleccioná ambas fechas", "warning");
      return;
    }

    if (new Date(fDesde) > new Date(fHasta)) {
      Swal.fire("Error", "La fecha desde no puede ser mayor a la hasta", "warning");
      return;
    }

    try {
      const { data } = await axios.get(`${TURNOS}/ver`, {
        params: {
          fechaDesde: fDesde,
          fechaHasta: fHasta,
        },
        withCredentials: true,
      });

      setTurnos(data);
      setPaginaActual(1); // 🔥 clave para evitar bug de paginación
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo filtrar", "error");
    }
  };

  const botonAccionStyle = {
    backgroundColor: "#6f42c1", border: "none", fontWeight: "bold", color: "#fff",
    boxShadow: "0 4px 0 #59359a", transition: "all 0.1s ease", padding: "10px 20px", borderRadius: "10px", whiteSpace: "nowrap"
  };
  const botonRapidoStyle = {
    backgroundColor: "#e2d9f3", color: "#6f42c1", border: "1px solid #6f42c1",
    fontWeight: "bold", transition: "all 0.15s ease", padding: "8px 15px", borderRadius: "8px", whiteSpace: "nowrap"
  };

  const botonLimpiar = () => {
    setFechaDesde('');
    setFechaHasta('');
    cargarTurnos();
    setPaginaActual(1);
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setTurnoId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFromType('');
  };

  const cargarTurnos = async () => {
    try {
      const response = await axios.get(`${TURNOS}/ver`, { withCredentials: true });
      setTurnos(response.data);
    } catch (error) {
      console.error('Error al cargar los Turnos:', error);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const turnosFiltrados = turnos.filter((turno) =>
    turno.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ── Paginación ──────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const turnosPaginados = turnosFiltrados.slice(
    indicePrimerElemento,
    indiceUltimoElemento
  );
  const totalPaginas = Math.ceil(
    turnosFiltrados.length / elementosPorPagina
  );

  const botonPaginacionStyle = {
    backgroundColor: "#6f42c1",
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 4px 0 #59359a",
    transition: "all 0.1s ease",
    padding: "8px 20px",
    borderRadius: "10px",
  };

  const borrarTurnos = async (id) => {

    const confirmacion = await Swal.fire({
      title: '¿Eliminar Turno?',
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

      const response = await axios.delete(`${TURNOS}/eliminar/${id}`, { withCredentials: true });

      if (response.status === 200) {

        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'El turno ha sido eliminado con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarTurnos();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar el turno:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el turno. Inténtalo nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6f42c1',
      });
    }
  };


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
        ><i className="bi bi-calendar2-check-fill" style={{ marginRight: "8px" }}></i>
          TURNOS
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

        {/* Fila superior: Filtros de fecha y Botones Rápidos */}
        <div className="d-flex align-items-center gap-2 p-3 bg-light rounded shadow-sm border flex-wrap" style={{ borderColor: '#e0e0e0' }}>
          <span className="fw-bold text-secondary">Desde:</span>
          <Form.Control
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            style={{ width: 'auto' }}
          />

          <span className="fw-bold text-secondary ms-2">Hasta:</span>
          <Form.Control
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            style={{ width: 'auto' }}
          />

          <Button
            style={botonAccionStyle}
            onClick={() => handleBuscarPorFechas()}
            className=""
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <i className="bi bi-search "></i>
          </Button>
          <Button
            style={botonAccionStyle}
            onClick={() => botonLimpiar()}
            className=""
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <i className="bi bi-trash3"></i>
          </Button>

          <div className="d-flex gap-2 ms-3 border-start ps-3" style={{ borderColor: '#ccc' }}>
            <Button
              style={botonRapidoStyle}
              className="btn-rapido"
              onClick={() => handleFiltroRapido(1)}
            >
              Último día
            </Button>
            <Button
              style={botonRapidoStyle}
              className="btn-rapido"
              onClick={() => handleFiltroRapido(3)}
            >
              Últimos 3 días
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center m-3 w-75">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de cliente"
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

            Crear un nuevo Turno
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
                  Nombre Cliente
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  Fecha
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  Hora
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  Estado
                </th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {turnosPaginados.length > 0 ? (
                turnosPaginados.map((turno, index) => (
                  <tr
                    key={index}
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
                      {turno.id_turno}
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
                      {turno.nombre_cliente}
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
                      {turno.fecha_hora.slice(0, 10)}
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
                      {turno.fecha_hora.slice(11, 16)}
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
                      {turno.estado}
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
                        onClick={() => handleOpenModal("ver", turno.id_turno)}
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
                        onClick={() => handleOpenModal("editar", turno.id_turno)}
                      >
                        Editar
                      </Button>

                      {/* Botón ELIMINAR */}
                      {/* <Button
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
                onClick={() => borrarTurnos(turno.id_turno)}
              >
                Eliminar
              </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Turnos.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* ── Controles de Paginación ── */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Button
                style={{
                  ...botonPaginacionStyle,
                  opacity: paginaActual === 1 ? 0.5 : 1,
                  cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                }}
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </Button>

              <span
                className="mx-4"
                style={{
                  fontWeight: "bold",
                  color: "#6f42c1",
                  fontSize: "1.1rem",
                }}
              >
                Página {paginaActual} de {totalPaginas}
              </span>

              <Button
                style={{
                  ...botonPaginacionStyle,
                  opacity: paginaActual === totalPaginas ? 0.5 : 1,
                  cursor:
                    paginaActual === totalPaginas ? "not-allowed" : "pointer",
                }}
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
        style={{ "--bs-modal-width": "900px" }}
      >
        <div
          style={{
            maxWidth: "900px",
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
              <i className="bi-calendar-event"></i>
            </div>

            <h3
              style={{
                fontWeight: "700",
                color: "#6f42c1",
                marginBottom: "4px",
              }}
            >
              <i className="bi bi-paw" style={{ marginRight: "6px" }}></i>
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
              padding: "26px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              maxHeight: "70vh", // 👈 CLAVE
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {fromType === "crear" && (
                <CrearTurno
                  onClose={handleCloseModal}
                  onUpdate={cargarTurnos}
                />
              )}

              {fromType === "ver" && (
                <VerTurno id_turno={turnoId} />
              )}

              {fromType === "editar" && (
                <EditarTurno
                  id_turno={turnoId}
                  onClose={handleCloseModal}
                  onUpdate={cargarTurnos}
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
  );
};

export default MainTurnos;

