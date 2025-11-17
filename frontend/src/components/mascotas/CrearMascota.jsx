import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { mascotas, ESPECIES, razas } from "../../endpoints/endpoints";

const CrearMascota = ({ id_cliente, onClose, onUpdate }) => {
  const [listaEspecies, setListaEspecies] = useState([]);
  const [listaRazas, setListaRazas] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState("");

  const [formData, setFormData] = useState({
    nombre_mascota: "",
    edad_mascota: "",
    sexo_mascota: "",
    id_raza: "",
  });

  // Cargar especies al iniciar
  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const { data } = await axios.get(`${ESPECIES}/ver`, {
          withCredentials: true,
        });
        setListaEspecies(data);
      } catch (error) {
        console.error("Error cargando especies:", error);
      }
    };

    fetchEspecies();
  }, []);

  // Cargar razas según la especie seleccionada
  useEffect(() => {
    if (!especieSeleccionada) return;

    const fetchRazas = async () => {
      try {
        const { data } = await axios.get(
          `${razas}/porEspecie/${especieSeleccionada}`,
          { withCredentials: true }
        );
        setListaRazas(data);
      } catch (error) {
        console.error("Error cargando razas:", error);
      }
    };

    fetchRazas();
  }, [especieSeleccionada]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${mascotas}/crear`,{
          ...formData,
          id_cliente,
        },
        { withCredentials: true }
      );

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al crear mascota:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <Form.Group>
        <Form.Label><strong>Nombre Mascota:</strong></Form.Label>
        <Form.Control
          type="text"
          name="nombre_mascota"
          value={formData.nombre_mascota}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label><strong>Edad:</strong></Form.Label>
        <Form.Control
          type="number"
          name="edad"
          value={formData.edad_mascota}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label><strong>Sexo:</strong></Form.Label>
        <Form.Select name="sexo" value={formData.sexo_mascota} onChange={handleChange}>
          <option value="">Seleccionar...</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </Form.Select>
      </Form.Group>

      <Form.Group>
        <Form.Label><strong>Especie:</strong></Form.Label>
        <Form.Select
          value={especieSeleccionada}
          onChange={(e) => setEspecieSeleccionada(e.target.value)}
          required
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
          required
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

      <Button
        type="submit"
        style={{
          backgroundColor: "#6f42c1",
          border: "none",
          padding: "10px 20px",
          borderRadius: "12px",
          fontWeight: "bold",
        }}
      >
        Guardar Mascota
      </Button>
    </Form>
  );
};

export default CrearMascota;