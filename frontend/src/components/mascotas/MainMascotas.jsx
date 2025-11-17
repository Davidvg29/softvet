import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

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
    editar: "Editar Mascota",
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

  const abrirModal = (type, id) => {
    setModalType(type);
    setMascotaId(id);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModalType("");
  };

  return (
    <>
      <div className="w-100 d-flex flex-column align-items-center mb-5">
        {/* BUSCADOR */}
        <Form.Control
          type="text"
          placeholder="Buscar mascota por nombre, sexo o raza"
          className="w-50 mb-4"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* LISTA */}
        <Table
          hover
          responsive
          style={{ width: "85%", borderSpacing: "0 12px" }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <th>Nombre</th>
              <th>Raza</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mascotasFiltradas.length > 0 ? (
              mascotasFiltradas.map((m) => (
                <tr key={m.id_mascota} style={{ background: "#fff" }}>
                  <td>{m.nombre_mascota}</td>
                  <td>{m.nombre_raza}</td>

                  <td className="d-flex justify-content-center gap-2">
                    <Button
                      style={{
                        backgroundColor: "#1ab637",
                        border: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => abrirModal("ver", m.id_mascota)}
                    >
                      Ver
                    </Button>

                    <Button
                      style={{
                        backgroundColor: "#ffc107",
                        border: "none",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                      onClick={() => abrirModal("editar", m.id_mascota)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No hay mascotas cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={cerrarModal} centered size="lg">
        <div
          style={{
            background: "linear-gradient(135deg, #FFD700, #32CD32)",
            padding: "25px",
            position: "relative",
          }}
        >
          <button
            onClick={cerrarModal}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              width: "30px",
              height: "30px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <h4 className="text-center fw-bold">{TITULOS[modalType]}</h4>

          <div className="p-4 bg-light rounded shadow">
            {modalType === "ver" && <VerMascota id_mascota={mascotaId} />}
            {modalType === "editar" && (
              <EditMascota
                id_mascota={mascotaId}
                onUpdate={cargarMascotas}
                onClose={cerrarModal}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainMascota;