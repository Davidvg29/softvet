import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Swal from "sweetalert2";

import { mascotas } from "../../endpoints/endpoints";
import VerMascota from "./VerMascota";
import EditMascota from "./EditMascota";

const MainMascota = () => {
  const [listaMascotas, setListaMascotas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [mascotaId, setMascotaId] = useState(null);

  const TITULOS = {
    ver: "Ver Mascota",
    editar: "Editar Mascota"
  };

  const cargarMascotas = async () => {
    try {
      const { data } = await axios.get(`${mascotas}/ver`, {
        withCredentials: true,
      });
      setListaMascotas(data);
    } catch (error) {
      console.error("Error al cargar mascotas:", error);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const mascotasFiltradas = listaMascotas.filter(
    (m) =>
      m.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.dni_cliente.toString().includes(busqueda)
  );

  const handleOpenModal = (type, id) => {
    setModalType(type);
    setMascotaId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
  };

  const borrarMascotas = async (id) => {

    const confirmacion = await Swal.fire({
      title: '¿Dar de baja Mascota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar Baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmacion.isConfirmed) return;

    try {

      const response = await axios.delete(`${mascotas}/eliminar/${id}`, { withCredentials: true });

      if (response.status === 200) {

        await Swal.fire({
          icon: 'success',
          title: 'Se dió Baja Correctamente',
          text: 'Las Mascota ha sido dada de Baja.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        cargarMascotas();
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error al dar de Baja la Mascota:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo dar Baja la Mascota. Inténtalo nuevamente.',
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
            placeholder="Buscar por nombre de Mascota o DNI de Cliente"
            className="w-50 mx-3"
            style={{ width: '700px' }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
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
                  <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>Nombre Mascota</th>
                  <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>DNI Cliente</th>
                  <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {mascotasFiltradas.length > 0 ? (
                  mascotasFiltradas.map((m) => (
                    <tr
                      key={m.id_mascota}
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
                      <td style={{
                        padding: "14px 20px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#333",
                        border: "none",
                      }}>
                        {m.nombre_mascota}
                      </td>

                      <td style={{
                        padding: "14px 20px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#333",
                        border: "none",
                      }}>
                        {m.dni_cliente}
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
                          onClick={() => handleOpenModal("ver", m.id_mascota)}
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
                          onClick={() => handleOpenModal("editar", m.id_mascota)}
                        >
                          Editar
                        </Button>

                        <Button
                          style={{
                            backgroundColor: "#6f42c1",
                            border: "none",
                            fontWeight: "bold",
                            color: "#fff",
                            boxShadow: "0 3px 0 #5428a5ff",
                            transition: "all 0.1s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 5px 0 #5428a5ff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 3px 0 #5428a5ff";
                          }}
                          // onClick={() => borrarMascotas(m.id_mascota)}
                        >
                          Historia Clinica
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
                          onClick={() => borrarMascotas(m.id_mascota)}
                        >
                          Dar Baja
                        </Button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                      No hay mascotas cargadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div >
        </div >

        {/* MODAL */}
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
              >{TITULOS[modalType]}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {modalType === "ver" && <VerMascota id_mascota={mascotaId} />}
                {modalType === "editar" && (<EditMascota id_mascota={mascotaId} onUpdate={cargarMascotas} onClose={handleCloseModal}
                />
                )}
              </div>
            </div>
          </div>

        </Modal>
      </>
      );
};

      export default MainMascota;