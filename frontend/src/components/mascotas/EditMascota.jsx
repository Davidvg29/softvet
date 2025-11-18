import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { mascotas, ESPECIES, razas } from "../../endpoints/endpoints";
import validationCrearMascotas from "../../validations/validationCrearMascotas";

const EditMascota = ({ id_mascota, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre_mascota: "",
    edad_mascota: "",
    sexo_mascota: "",
    id_raza: "",
  });

  const [listaEspecies, setListaEspecies] = useState([]);
  const [listaRazas, setListaRazas] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const esp = await axios.get(`${ESPECIES}/ver`, {
          withCredentials: true,
        });
        console.log("ESPECIES:", esp.data);
        setListaEspecies(esp.data);

        const mascotaRes = await axios.get(`${mascotas}/ver/${id_mascota}`, { withCredentials: true });
        const m = mascotaRes.data;

        setFormData({
          nombre_mascota: m.nombre_mascota,
          edad_mascota: m.edad_mascota,
          sexo_mascota: m.sexo_mascota,
          id_raza: m.id_raza,
        });

        setEspecieSeleccionada(m.id_especie);

        const razasRes = await axios.get(`${razas}/porEspecie/${m.id_especie}`, { withCredentials: true });
        setListaRazas(razasRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id_mascota]);

  // Cargar razas cuando cambia la especie
  useEffect(() => {
    if (!especieSeleccionada) return;

    const fetchRazas = async () => {
      try {
        const r = await axios.get(`${razas}/porEspecie/${especieSeleccionada}`, { withCredentials: true });
        setListaRazas(r.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRazas();
  }, [especieSeleccionada]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    const validation = validationCrearMascotas(
      formData.nombre_mascota,
      formData.edad_mascota,
      formData.sexo_mascota,
      especieSeleccionada,
      formData.id_raza
    );

    if (validation.length !== 0) {
      return Swal.fire({
        icon: "warning",
        title: "Atención",
        text: validation,
        confirmButtonColor: "#6f42c1",
      });
    }

    try {
      await axios.put(
        `${mascotas}/editar/${id_mascota}`,
        {
          ...formData,
          id_especie: especieSeleccionada,
        },
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "Mascota actualizada",
        confirmButtonColor: "#6f42c1",
      });

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la mascota.",
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#cfcfcf",
        borderRadius: "10px",
        padding: "25px 40px",
        color: "#000",
      }}
    >
    <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px 20px",
            textAlign: "left",
          }}
        >
          <Form.Group>
            <Form.Label><strong>Nombre Mascota:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_mascota"
              value={formData.nombre_mascota}
              onChange={handleChange}
              placeholder="Nombre de la Mascota"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Edad:</strong></Form.Label>
            <Form.Control
              type="number"
              name="edad_mascota"
              value={formData.edad_mascota}
              onChange={handleChange}
              placeholder="Edad de la Mascota"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Sexo:</strong></Form.Label>
            <Form.Select
              name="sexo_mascota"
              value={formData.sexo_mascota}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Seleccionar...</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Especie:</strong></Form.Label>
            <Form.Select
              value={especieSeleccionada}
              onChange={(e) => {
                setEspecieSeleccionada(e.target.value);
                setFormData({ ...formData, id_raza: "" });
              }}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Seleccionar especie...</option>
              {listaEspecies.map((esp) => (
                <option key={esp.id_especie} value={esp.id_especie}>
                  {esp.nombre_especie}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Raza:</strong></Form.Label>
            <Form.Select
              name="id_raza"
              value={formData.id_raza}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
              disabled={!especieSeleccionada}
            >
              <option value="">Seleccionar raza...</option>
              {listaRazas.map((raza) => (
                <option key={raza.id_raza} value={raza.id_raza}>
                  {raza.nombre_raza}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* BOTONES */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Button
            type="submit"
            style={{
              backgroundColor: "#5a7edc",
              border: "none",
              borderRadius: "20px",
              padding: "10px 28px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #3c5bb3",
              transition: "all 0.1s ease",
            }}
          >
            Guardar
          </Button>

          <Button
            onClick={onClose}
            style={{
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: "20px",
              padding: "10px 28px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #b33a2b",
              transition: "all 0.1s ease",
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMascota;