import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { VENTAS } from '../../endpoints/endpoints';
import VerVenta from './VerVenta';
import CrearVenta from './CrearVenta';
import EditVenta from './EditVenta';

const MainVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaId, setVentaId] = useState(null);
  const [ventaSelect, setVentaSelect] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');

  const TITULOS = {
    crear: 'Nueva Venta',
    ver: 'Ver Venta',
    editar: 'Editar Venta',
  };

  const handleOpenModal = (type, id = null, venta) => {
    setFromType(type);
    setVentaId(id);
    setVentaSelect(venta)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // console.log('cerrar modal');
    setShowModal(false);
    setFromType('');
    setVentaId(null);
    setVentaSelect(null)
  };

  const cargarVentas = async () => {
    try {
      const {data} = await axios.get(`${VENTAS}/ver`, { withCredentials: true });
      const ventasFilter = data.filter((v)=>(v.is_active == 1))
      setVentas(ventasFilter || []);
    } catch (error) {
      console.error('Error al cargar las ventas:', error);
      setVentas([]);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const ventasFiltrados = ventas.filter((venta) =>
    (venta.nombre_cliente || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const borrarVentas = async (id_venta) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar Venta?',
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
      // Usar la constante VENTAS (antes había `${ventas}` que es incorrecto)
      const response = await axios.put(`${VENTAS}/borrar/${id_venta}`, {},{ withCredentials: true });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'La venta ha sido eliminada con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarVentas();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar venta:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la venta. Inténtalo nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6f42c1',
      });
    }
  };

  return (
    <>
      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">
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
            Crear nueva venta
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
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>Fecha</th>
                <th style={{ padding: "14px" }}>Hora</th>
                <th style={{ padding: "14px" }}>Cliente</th>
                <th style={{ padding: "14px" }}>Total</th>
                <th style={{ padding: "14px" }}>Empleado</th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltrados.length > 0 ? (
                ventasFiltrados.map((venta) => (
                  <tr
                    key={venta.id_venta}
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
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none" }}>
                      {venta.fecha_hora?.slice(0, 10) ?? ''}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none" }}>
                      {venta.fecha_hora?.slice(11, 16) ?? ''}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none" }}>
                      {venta.nombre_cliente}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none" }}>
                      $ {venta.total}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none" }}>
                      {venta.nombre_empleado}
                    </td>
                    <td style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", padding: "12px", border: "none" }}>
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
                        onClick={() => handleOpenModal("ver", venta.id_venta, venta)}
                      >
                        Ver
                      </Button>

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
                        onClick={() => handleOpenModal("editar", venta.id_venta, venta)}
                      >
                        Editar
                      </Button>

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
                        onClick={() => borrarVentas(venta.id_venta)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static" size="lg">
        <div
          style={{
            background: 'linear-gradient(135deg, #FFD700, #32CD32)',
            padding: '25px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
        >
          <button
            onClick={handleCloseModal}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#e74c3c',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
          >
            ✕
          </button>

          <div
            style={{
              backgroundColor: '#cfcfcf',
              padding: '30px 20px',
              textAlign: 'center',
              width: '100%',
              margin: 'auto',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
            }}
          >
            <h4 style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '0px' }}>
              {TITULOS[fromType] || ''}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {fromType === 'crear' && (
                // Descomenta si tenés el componente CrearVenta
                <CrearVenta onClose={handleCloseModal} onUpdate={cargarVentas} cargarVentas={cargarVentas}/>
              )}

              {fromType === 'ver' && <VerVenta venta={ventaSelect} />}

              {fromType === 'editar' && (
                // Descomenta si tenés el componente EditVenta
                <EditVenta id_venta={ventaId} onClose={handleCloseModal} onUpdate={cargarVentas} />
                // <div>Editar venta (componente EditVenta aquí)</div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainVentas;
