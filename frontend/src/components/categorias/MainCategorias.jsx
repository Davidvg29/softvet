import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { categorias } from '../../endpoints/endpoints';
import CrearCategorias from './CrearCategorias';
import VerCategorias from './VerCategorias';
import EditCategorias from './EditCategorias';

const MainCategorias = () => {
  const [categoria, setCategoria] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');

  const TITULOS = {
    crear: 'Nueva Categoria',
    ver: 'Ver Categoria',
    editar: 'Editar Categoria',
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setCategoriaId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('cerrar modal');
    setShowModal(false);
    setFromType('');
  };

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(`${categorias}/ver`, { withCredentials: true });
      setCategoria(response.data.reverse());
    } catch (error) {
      console.error('Error al cargar las Categorias:', error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const categoriasFiltrados = categoria.filter((categoria) =>
    categoria.nombre_categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ── Paginación ──────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const categoriasPaginadas = categoriasFiltrados.slice(
    indicePrimerElemento,
    indiceUltimoElemento
  );
  const totalPaginas = Math.ceil(
    categoriasFiltrados.length / elementosPorPagina
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

  const borrarCategorias = async (id) => {

    const confirmacion = await Swal.fire({
      title: '¿Eliminar categoria?',
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

      const response = await axios.delete(`${categorias}/eliminar/${id}`, { withCredentials: true });

      if (response.status === 200) {

        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'La categoria ha sido eliminada con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarCategorias();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar categoria:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la categoria. Inténtalo nuevamente.',
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
        ><i className="bi bi-tags-fill" style={{marginRight: "8px"}}></i>
          CATEGORIAS
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
        <div className="d-flex justify-content-center align-items-center m-3 w-75">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de la categoria"
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

            Crear un nueva Categoria
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
                  Nombre Categoria
                </th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {categoriasPaginadas.length > 0 ? (
                categoriasPaginadas.map((categoria) => (
                  <tr
                    key={categoria.id_categoria}
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
                      {categoria.id_categoria}
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
                      {categoria.nombre_categoria}
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
                        onClick={() => handleOpenModal("ver", categoria.id_categoria)}
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
                        onClick={() => handleOpenModal("editar", categoria.id_categoria)}
                      >
                        Editar
                      </Button>

                      {/* Botón ELIMINAR */}
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
                        onClick={() => borrarCategorias(categoria.id_categoria)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Categorias.
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
                    paginaActual === totalPaginas
                      ? "not-allowed"
                      : "pointer",
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
  style={{ "--bs-modal-width": "650px" }} // 👈 más chico
>
  <div
    style={{
      maxWidth: "650px",
      width: "100%",
      margin: "auto",

      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.9)",
      borderRadius: "18px",
      padding: "20px",
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

    {/* Botón cerrar */}
    <button
      onClick={handleCloseModal}
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "none",
        background: "#f3f0ff",
        color: "#6f42c1",
        fontSize: "16px",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.target.style.background = "#e0d7ff")}
      onMouseLeave={(e) => (e.target.style.background = "#f3f0ff")}
    >
      ✕
    </button>

    {/* HEADER */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          marginBottom: "10px",
          color: "#fff",
          fontSize: "20px",
          boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
        }}
      >
        <i className="bi-tags"></i> {/* 🏷️ icono ideal */}
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
          width: "60px",
          height: "4px",
          background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
          margin: "8px auto 0",
          borderRadius: "10px",
        }}
      />
    </div>

    {/* CONTENIDO */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {fromType === "crear" && (
          <CrearCategorias
            onClose={handleCloseModal}
            onUpdate={cargarCategorias}
          />
        )}

        {fromType === "ver" && (
          <VerCategorias id_categoria={categoriaId} />
        )}

        {fromType === "editar" && (
          <EditCategorias
            id_categoria={categoriaId}
            onClose={handleCloseModal}
            onUpdate={cargarCategorias}
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
          transform: scale(0.94) translateY(10px);
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

export default MainCategorias;
