import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { productos } from '../../endpoints/endpoints';
import CrearProducto from './CrearProducto';
import VerProducto from './VerProducto';
import EditProducto from './EditProducto';
import { useEmpleadoStore } from '../../zustand/empleado';

const MainProducto = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const rolUsuario = empleado?.nombre_rol || "";
  const [producto, setProducto] = useState([]);
  const [productoId, setProductoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');

  // --- Estado de Filtro ---
  const [filtroActivo, setFiltroActivo] = useState("todos");

  const TITULOS = {
    crear: 'Nuevo Producto',
    ver: 'Ver Producto',
    editar: 'Editar Producto',
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setProductoId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFromType('');
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get(`${productos}/ver`, { withCredentials: true });
      setProducto(response.data);
    } catch (error) {
      console.error('Error al cargar los Productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // --- Lógica de Filtrado ---
  const productosFiltrados = producto.filter((prod) => {
    const coincideBusqueda =
      prod.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.codigo_producto.toString().includes(busqueda);

    // Filtro por estado activo/inactivo
    let coincideEstado = true;
    if (filtroActivo === "activos") coincideEstado = prod.producto_is_active === 1;
    if (filtroActivo === "inactivos") coincideEstado = prod.producto_is_active === 0;

    // Restricción de seguridad: no-admin solo ve activos
    const puedeVerPorRol = rolUsuario === 'Administrador' ? true : prod.producto_is_active;

    return coincideBusqueda && coincideEstado && puedeVerPorRol;
  });

  // ── Paginación ──────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroActivo]);

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);
  const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina);

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

 // --- Lógica de Acciones Protegidas ---
  
  const borrarProductos = async (id) => {
    if (rolUsuario !== "Administrador") {
      Swal.fire({ icon: "error", title: "Acceso Denegado", text: "Solo el Administrador puede dar de baja productos.", confirmButtonColor: "#6f42c1" });
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Dar de Baja Producto?',
      text: 'El producto dejará de estar disponible para la venta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar la Baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.delete(`${productos}/eliminar/${id}`, {
        data: { id_empleado: empleado.id_empleado },
        withCredentials: true
      });
      if (response.status === 200) {
        await Swal.fire({ icon: 'success', title: 'Producto desactivado', confirmButtonColor: '#6f42c1' });
        cargarProductos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const activarProductoFront = async (id) => {
    if (rolUsuario !== "Administrador") {
      Swal.fire({ icon: "error", title: "Acceso Denegado", text: "No tienes permisos para esta acción.", confirmButtonColor: "#6f42c1" });
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Activar Producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      confirmButtonColor: '#28a745',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await axios.put(`${productos}/activar/${id}`, { id_empleado: empleado.id_empleado }, { withCredentials: true });
      if (response.status === 200) {
        await Swal.fire({ icon: 'success', title: 'Activado correctamente', confirmButtonColor: '#6f42c1' });
        cargarProductos();
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleAccionProducto = (type, id = null) => {
    if (type === 'ver') {
      handleOpenModal('ver', id);
      return;
    }
    // Protección para Crear y Editar
    if (rolUsuario !== "Administrador") {
      Swal.fire({ icon: "error", title: "Acceso Denegado", text: "Solo el Administrador puede realizar esta acción.", confirmButtonColor: "#6f42c1" });
      return;
    }
    handleOpenModal(type, id);
  };

  return (
    <>
      <div className="text-center">
        <h1
          className="fw-bold animate-title p-2 mb-2 d-inline-block"
          style={{
            background: "linear-gradient(90deg, #6f42c1, #8f41aeff)",
            fontSize: "2.5rem",
            color: "#fff",
            marginTop: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            borderRadius: "12px",
          }}
        >
          <i className="bi bi-box-seam" style={{ marginRight: "8px" }}></i>
          PRODUCTOS
        </h1>
      </div>

      <style>
        {`.animate-title { opacity: 0; transform: translateY(10px); animation: fadeSlide 0.6s ease-out forwards; }
          @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>

      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">

        {/* Filtros de Estado */}
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
                  background: filtroActivo === item.key ? "#6f42c1" : "#f1f1f1",
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
            placeholder="Buscar por nombre o Código del Producto"
            className="w-50 mx-3"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button
            onClick={() => handleAccionProducto('crear')}
            style={{
              backgroundColor: "#6f42c1", border: "none", fontWeight: "bold", color: "#fff",
              boxShadow: "0 4px 0 #6f42c1", transition: "all 0.1s ease",
            }}
          >
            Crear un nuevo Producto
          </Button>
        </div>

        <div
          style={{
            border: "3px solid #6f42c1", borderRadius: "16px", padding: "25px",
            backgroundColor: "#f8f9fa", boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "85%", maxWidth: "950px", marginTop: "30px",
          }}
        >
          <Table hover responsive style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #6f42c1, #9b59b6)", color: "#fff", textAlign: "center", fontSize: "18px" }}>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>N°</th>
                <th style={{ padding: "14px" }}>Nombre Producto</th>
                <th style={{ padding: "14px" }}>Código Producto</th>
                <th style={{ padding: "14px" }}>Stock Disponible</th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.length > 0 ? (
                productosPaginados.map((prod) => (
                  <tr key={prod.id_producto} style={{ backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{prod.id_producto}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{prod.nombre_producto}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{prod.codigo_producto}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", border: "none" }}>{prod.cantidad}</td>
                    <td style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "12px", border: "none" }}>

                      {/* Botón VER */}
                      <Button
                        style={{ backgroundColor: "#1ab637", border: "none", fontWeight: "bold", color: "#fff", boxShadow: "0 3px 0 #138a28", transition: "all 0.1s ease" }}
                        onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 5px 0 #138a28"; }}
                        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 3px 0 #138a28"; }}
                        onClick={() => handleAccionProducto("ver", prod.id_producto)}
                      >Ver</Button>

                      {/* Botón EDITAR */}
                      <Button
                        style={{ backgroundColor: "#ffc107", border: "none", fontWeight: "bold", color: "#333", boxShadow: "0 3px 0 #d39e00", transition: "all 0.1s ease" }}
                        onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 5px 0 #d39e00"; }}
                        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 3px 0 #d39e00"; }}
                        onClick={() => handleAccionProducto("editar", prod.id_producto)}
                      >Editar</Button>

                      {/* Botón ELIMINAR / ACTIVAR */}
                      {prod.producto_is_active ? (
                        <Button
                          style={{ backgroundColor: "#dc3545", border: "none", fontWeight: "bold", color: "#fff", boxShadow: "0 3px 0 #a71d2a", transition: "all 0.1s ease" }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 5px 0 #a71d2a"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 3px 0 #a71d2a"; }}
                          onClick={() => borrarProductos(prod.id_producto)}
                        >Dar Baja</Button>
                      ) : (
                        rolUsuario === "Administrador" && (
                        <Button
                          style={{ backgroundColor: "#e8e8e8", border: "none", fontWeight: "bold", color: "#040404", boxShadow: "0 3px 0 #a71d2a", transition: "all 0.1s ease" }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 5px 0 #a71d2a"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 3px 0 #a71d2a"; }}
                          onClick={() => activarProductoFront(prod.id_producto)}
                        >Activar</Button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center p-4">No se encontraron Productos.</td></tr>
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static" contentClassName="bg-transparent border-0" dialogClassName="bg-transparent" style={{ "--bs-modal-width": "750px" }}>
        <div style={{ maxWidth: "750px", width: "100%", backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.9)", borderRadius: "18px", padding: "22px", position: "relative", border: "2px solid #6f42c1", boxShadow: "0 20px 60px rgba(111,66,193,0.25)" }}>
          <button onClick={handleCloseModal} style={{ position: "absolute", top: "14px", right: "14px", width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#f3f0ff", color: "#6f42c1", cursor: "pointer" }}>✕</button>
          <div className="text-center mb-4">
            <h3 style={{ fontWeight: "700", color: "#6f42c1" }}>{TITULOS[fromType]}</h3>
          </div>
          <div style={{ background: "#fff", borderRadius: "18px", padding: "26px", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            {fromType === "crear" && <CrearProducto onClose={handleCloseModal} onUpdate={cargarProductos} />}
            {fromType === "ver" && <VerProducto id_producto={productoId} />}
            {fromType === "editar" && <EditProducto id_producto={productoId} onClose={handleCloseModal} onUpdate={cargarProductos} />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainProducto;