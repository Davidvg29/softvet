import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
import { historiasClinicas } from '../../endpoints/endpoints';
import { useEmpleadoStore } from "../../zustand/empleado";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import VerHistoriaClinica from './VerHistoriaClinica';
import DetalleHistoriaClinica from './DetalleHistoriaClinica';
import CrearHistoriaClinica from './CrearHistoriaClinica';
import EditarHistoriaClinica from './EditarHistoriaClinica';
const MainHistoriaClinica = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const rolUsuario = empleado?.nombre_rol || "";

  //state de busqueda
  const [busqueda, setBusqueda] = useState("");


  const [historiaClinica, setHistoriaClinica] = useState([]);

  const [historiaClinicaId, setHistoriaClinicaId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [fromType, setFromType] = useState("");

  //funcion de apertura modal
  const handleOpenModal = (type, id = null) => {
    setFromType(type);
    setHistoriaClinicaId(id);
    setShowModal(true);
  };

  //funcion de cierre de la modal
  const handleCloseModal = (type) => {
    setShowModal(false);
    setFromType("");
  };

  const TITULOS = {

    crearhistoriaClinica: "Crear Historia Clinica",
    verhistoriaClinica: "Ver Historia Clinica",
    editarhistoriaClinica: "Editar Historia Clinica",
    detalleHistoriaClinica: "Detalle Historia Clinica",
  };

  const cargarHistoriaClinica = async () => {
    try {

      const { data } = await axios.get(`${historiasClinicas}/ver`, { withCredentials: true });
      console.log(data);
      setHistoriaClinica(data);
    } catch (error) {
      console.error("Error al cargar las Historia Clinica:", error);
    }
  };

  useEffect(() => {
    cargarHistoriaClinica();
  }, []);


  const normalize = (text) =>

    String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .trim();

  const q = normalize(busqueda);

  const historiaClinicaFiltrados = historiaClinica.filter((h) => {
    const nombre = normalize(h.nombre_cliente);
    const dni = normalize(h.dni_cliente);
    const observaciones = normalize(h.observaciones_generales);


    return (
      (nombre || '').includes(q) || // Asegura que 'nombre' es un string
      (dni || '').includes(q) ||     // Asegura que 'dni' es un string
      (observaciones || '').includes(q) // Asegura que 'observaciones' es un string
    );
  });

  historiaClinicaFiltrados.sort((a, b) => {
    const na = normalize(a.nombre_cliente);
    const nb = normalize(b.nombre_cliente);
    const da = normalize(a.dni_cliente);
    const db = normalize(b.dni_cliente);

    // PRIORIDAD 1: Nombre coincide EXACTO
    if (na === q && nb !== q) return -1;
    if (nb === q && na !== q) return 1;

    // PRIORIDAD 2: Nombre coincide PARCIAL
    if (na.startsWith(q) && !nb.startsWith(q)) return -1;
    if (nb.startsWith(q) && !na.startsWith(q)) return 1;

    // PRIORIDAD 3: DNI coincide EXACTO
    if (da === q && db !== q) return -1;
    if (db === q && da !== q) return 1;

    // PRIORIDAD 4: DNI coincide parcial
    if (da.startsWith(q) && !db.startsWith(q)) return -1;
    if (db.startsWith(q) && !da.startsWith(q)) return 1;

    // PRIORIDAD 5: Lo demás queda igual
    return 0;
  });


  const borrar = async (id_historia_clinica) => {

    if (rolUsuario !== "Administrador" && rolUsuario !== "Veterinario") {
      return Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Solo los usuarios con rol 'Administrador' o 'Veterinario' pueden eliminar historias clínicas."
      });
    }

    const result = await Swal.fire({
      title: "¿Eliminar Historia clínica?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${historiasClinicas}/eliminar/${id_historia_clinica}`, { withCredentials: true });
      Swal.fire("Eliminado", "La historia clínica fue eliminada correctamente.", "success");
      cargarHistoriaClinica();
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la historia clínica.", "error");
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5" >
        <div className=' d-flex justify-content-center align-items-center m-3 w-75'  >
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o DNI"
            className=" w-50 mx-3"
            style={{ width: '700px' }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button
            onClick={() => handleOpenModal("crearhistoriaClinica")}
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
            Dar de Alta Historia Clinica
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
          }}>
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
                  Nombre
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  DNI Cliente
                </th>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                  Observaciones
                </th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className=''>
              {historiaClinicaFiltrados.length > 0 ? (
                [...historiaClinicaFiltrados]
                  .sort((a, b) => b.id_historia_clinica - a.id_historia_clinica)
                  .map((historiaClinica) => (
                    <tr key={historiaClinica.id_historia_clinica}
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
                      >{historiaClinica.nombre_cliente}</td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontWeight: "500",
                          textAlign: "center",
                          color: "#333",
                          border: "none",
                        }}
                      >{historiaClinica.dni_cliente}</td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontWeight: "500",
                          textAlign: "center",
                          color: "#333",
                          border: "none",
                        }}
                      >{historiaClinica.observaciones_generales}</td>
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
                          onClick={() => handleOpenModal("verhistoriaClinica", historiaClinica.id_historia_clinica)}>Ver</Button>
                        {(rolUsuario === "Administrador" || rolUsuario === "Veterinario") && (
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
                          onClick={() => handleOpenModal("detalleHistoriaClinica", historiaClinica.id_historia_clinica)}>Agregar Detalle</Button>

                        )}
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
                          onClick={() => handleOpenModal("editarhistoriaClinica", historiaClinica.id_historia_clinica)} >Editar</Button>



                        {(rolUsuario === "Administrador" || rolUsuario === "Veterinario") && (
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
                            onClick={() => borrar(historiaClinica.id_historia_clinica)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </td>

                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Historias Clinicas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        size="lg">

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
              {fromType === "crearhistoriaClinica" && <CrearHistoriaClinica onClose={handleCloseModal} onUpdated={cargarHistoriaClinica} />}
              {fromType === "verhistoriaClinica" && <VerHistoriaClinica id={historiaClinicaId} />}{/*paso el id por prop */}
              {fromType === "detalleHistoriaClinica" && <DetalleHistoriaClinica idHistoriaClinica={historiaClinicaId} onClose={handleCloseModal} onUpdated={cargarHistoriaClinica} />}
              {fromType === "editarhistoriaClinica" && <EditarHistoriaClinica id={historiaClinicaId} onClose={handleCloseModal} onUpdated={cargarHistoriaClinica} />}
            </div>
          </div>
        </div>


      </Modal>
    </>
  )
}

export default MainHistoriaClinica