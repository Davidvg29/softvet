import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ESPECIES } from '../../endpoints/endpoints';
import CrearEspecies from './CrearEspecies';
import VerEspecies from './VerEspecies';
import EditEspecies from './EditEspecies';

const MainEspecies = () => {
  const [especies, setEspecies] = useState([]);
  const [especiesId, setEspeciesId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState('');

  const TITULOS = {
    crear: 'Nueva Especie',
    ver: 'Ver Especie',
    editar: 'Editar Especie',
  };

  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setEspeciesId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('cerrar modal');
    setShowModal(false);
    setFromType('');
  };

  const cargarEspecies = async () => {
    try {
      const response = await axios.get(`${ESPECIES}/ver`, { withCredentials: true });
      setEspecies(response.data);
    } catch (error) {
      console.error('Error al cargar los especies:', error);
    }
  };

  useEffect(() => {
    cargarEspecies();
  }, []);

  const especiesFiltrados = especies.filter((especie) =>
    especie.nombre_especie.toLowerCase().includes(busqueda.toLowerCase())
  );

  const borrarEspecies = async (id) => {

    const confirmacion = await Swal.fire({
      title: '¿Eliminar especie?',
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

      const response = await axios.delete(`${ESPECIES}/eliminar/${id}`, { withCredentials: true });

      if (response.status === 200) {

        await Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          text: 'La especie ha sido eliminada con éxito.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarEspecies();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al eliminar especie:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la especie. Inténtalo nuevamente.',
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
            placeholder="Buscar por nombre de especie"
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

            Crear un nueva Especie
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
          Nombre Especie
        </th>
        <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
          Acciones
        </th>
      </tr>
    </thead>

    <tbody>
      {especiesFiltrados.length > 0 ? (
        especiesFiltrados.map((especie) => (
          <tr
            key={especie.id_especie}
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
              {especie.nombre_especie}
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
                onClick={() => handleOpenModal("ver", especie.id_especie)}
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
                onClick={() => handleOpenModal("editar", especie.id_especie)}
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
                onClick={() => borrarEspecies(especie.id_especie)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
            No se encontraron Especies.
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
          <CrearEspecies onClose={handleCloseModal} onUpdate={cargarEspecies} />
        )}
        {fromType === 'ver' && <VerEspecies id_especie={especiesId} />}
        {fromType === 'editar' && (
          <EditEspecies
            id_especie={especiesId}
            onClose={handleCloseModal}
            onUpdate={cargarEspecies}
          />
        )}
      </div>
    </div>
  </div>
</Modal>
    </>
  );
};

export default MainEspecies;
