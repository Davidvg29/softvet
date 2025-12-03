import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ROLES } from '../../endpoints/endpoints';
import CrearRoles from './CrearRoles';
import VerRoles from './VerRoles';
import EditRoles from './EditRoles';

const MainRoles = () => {
  const [roles, setRoles] = useState([]);
  const [rolesId, setRolesId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');

  const TITULOS = {
    crear: 'Nuevo Rol',
    ver: 'Ver Rol',
    editar: 'Editar Rol',
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setRolesId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('cerrar modal');
    setShowModal(false);
    setFromType('');
  };

  const cargarRoles = async () => {
    try {
      const response = await axios.get(`${ROLES}/ver`, { withCredentials: true });
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre_rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  const borrarRoles = async (id) => {

    const confirmacion = await Swal.fire({
      title: '¿Eliminar rol?',
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

      const response = await axios.delete(`${ROLES}/eliminar/${id}`, { withCredentials: true });

      if (response.status === 200) {

        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'El rol ha sido eliminado con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarRoles();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar el rol:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el rol. Inténtalo nuevamente.',
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
        ><i className="bi bi-shield-check" style={{marginRight: "8px"}}></i>
          ROLES
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
            placeholder="Buscar por nombre de rol"
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

            Crear un nuevo Rol
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
                  Nombre Rol
                </th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {rolesFiltrados.length > 0 ? (
                rolesFiltrados.map((rol) => (
                  <tr
                    key={rol.id_rol}
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
                      {rol.nombre_rol}
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
                        onClick={() => handleOpenModal("ver", rol.id_rol)}
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
                        onClick={() => handleOpenModal("editar", rol.id_rol)}
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
                        onClick={() => borrarRoles(rol.id_rol)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Roles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        size="lg"
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #FFD700, #32CD32)',
            padding: '25px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
        >
          {/* Botón de cerrar (cruz roja más chica y cuadrada) */}
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

          {/* Caja interior del modal */}
          <div
            style={{
              backgroundColor: '#cfcfcf',
              padding: '30px 60px',
              textAlign: 'center',
              width: '700px',
              margin: 'auto',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
            }}
          >
            <h4
              style={{
                fontWeight: 'bold',
                textDecoration: 'underline',
                marginBottom: '25px',
              }}
            >
              {TITULOS[fromType]}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {fromType === 'crear' && (
                <CrearRoles onClose={handleCloseModal} onUpdate={cargarRoles} />
              )}
              {fromType === 'ver' && <VerRoles id_rol={rolesId} />}
              {fromType === 'editar' && (
                <EditRoles
                  id_rol={rolesId}
                  onClose={handleCloseModal}
                  onUpdate={cargarRoles}
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainRoles;
