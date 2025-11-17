import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { mascotas, especies, razas } from "../../endpoints/endpoints";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const esp = await axios.get(`${especies}/ver`);
        setListaEspecies(esp.data);

        const mascotaRes = await axios.get(`${mascotas}/ver/${id_mascota}`);
        const m = mascotaRes.data;

        setFormData({
          nombre_mascota: m.nombre_mascota,
          edad: m.edad,
          sexo: m.sexo,
          id_raza: m.id_raza,
        });

        setEspecieSeleccionada(m.id_especie);

        const raz = await axios.get(`${razas}/porEspecie/${m.id_especie}`);
        setListaRazas(raz.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id_mascota]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${mascotas}/editar/${id_mascota}`, formData);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre_mascota"
          value={formData.nombre_mascota}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Edad</Form.Label>
        <Form.Control
          type="number"
          name="edad"
          value={formData.edad_mascota}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Sexo</Form.Label>
        <Form.Select
          name="sexo"
          value={formData.sexo_mascota}
          onChange={handleChange}
        >
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </Form.Select>
      </Form.Group>

      <Form.Group>
        <Form.Label>Especie</Form.Label>
        <Form.Select
          value={especieSeleccionada}
          onChange={(e) => setEspecieSeleccionada(e.target.value)}
        >
          {listaEspecies.map((esp) => (
            <option key={esp.id_especie} value={esp.id_especie}>
              {esp.nombre_especie}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group>
        <Form.Label>Raza</Form.Label>
        <Form.Select
          name="id_raza"
          value={formData.id_raza}
          onChange={handleChange}
        >
          {listaRazas.map((raza) => (
            <option key={raza.id_raza} value={raza.id_raza}>
              {raza.nombre_raza}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button type="submit" style={{ background: "#6f42c1", border: "none" }}>
        Guardar Cambios
      </Button>
    </Form>
  );
};

export default EditMascota;