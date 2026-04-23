import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { mascotas, ESPECIES, razas } from "../../endpoints/endpoints";
import validationCrearMascotas from "../../validations/validationCrearMascotas";
import { useEmpleadoStore } from "../../zustand/empleado";
import { FormGroup } from "react-bootstrap";

const EditMascota = ({ id_mascota, onClose, onUpdate }) => {
  const { empleado } = useEmpleadoStore();

  const [formData, setFormData] = useState({
    nombre_mascota: "",
    edad_mascota: "",
    sexo_mascota: "",
    id_raza: "",
  });

  const [listaEspecies, setListaEspecies] = useState([]);
  const [listaRazas, setListaRazas] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState("");

  const [mascotaData, setMascotaData] = useState(null);

  // 🔹 1. Cargar especies + mascota
  useEffect(() => {
    const fetchData = async () => {
      try {
        const esp = await axios.get(`${ESPECIES}/ver`, {
          withCredentials: true,
        });
        setListaEspecies(esp.data);

        const mascotaRes = await axios.get(
          `${mascotas}/ver/${id_mascota}`,
          { withCredentials: true }
        );

        const m = mascotaRes.data;
        setMascotaData(m);

        setFormData({
          nombre_mascota: m.nombre_mascota || "",
          edad_mascota: m.edad_mascota || "",
          sexo_mascota: m.sexo_mascota || "",
          id_raza: m.id_raza ? String(m.id_raza) : "",
        });

        // 👉 si viene id_especie lo usamos
        if (m.id_especie) {
          setEspecieSeleccionada(String(m.id_especie));
        } else if (m.nombre_especie) {
          // 👉 fallback si NO viene id_especie
          const especieEncontrada = esp.data.find(
            (e) => e.nombre_especie === m.nombre_especie
          );
          if (especieEncontrada) {
            setEspecieSeleccionada(String(especieEncontrada.id_especie));
          }
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id_mascota]);

  // 🔹 2. Cargar razas según especie
  useEffect(() => {
    if (!especieSeleccionada) return;

    const fetchRazas = async () => {
      try {
        const r = await axios.get(
          `${razas}/porEspecie/${especieSeleccionada}`,
          { withCredentials: true }
        );

        setListaRazas(r.data);

        // 👉 si NO tenemos id_raza pero sí nombre, lo resolvemos acá
        if (mascotaData && !mascotaData.id_raza && mascotaData.nombre_raza) {
          const razaEncontrada = r.data.find(
            (ra) => ra.nombre_raza === mascotaData.nombre_raza
          );

          if (razaEncontrada) {
            setFormData((prev) => ({
              ...prev,
              id_raza: String(razaEncontrada.id_raza),
            }));
          }
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchRazas();
  }, [especieSeleccionada, mascotaData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          id_empleado: empleado?.id_empleado,
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
    <div style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", padding: "25px 40px" }}>
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px 20px",
            textAlign: "left",
          }}
        >          <Form.Group>
            <Form.Label><strong>Nombre Mascota:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_mascota"
              value={formData.nombre_mascota}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label><strong>Edad:</strong></Form.Label>
            <Form.Control
              type="number"
              name="edad_mascota"
              value={formData.edad_mascota}
              onChange={handleChange}
              placeholder="Edad"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label><strong>Sexo:</strong></Form.Label>
            <Form.Select
              name="sexo_mascota"
              value={formData.sexo_mascota}
              onChange={handleChange}
            >
              <option value="">Sexo</option>
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
            >
              <option value="">Especie</option>
              {listaEspecies.map((esp) => (
                <option key={esp.id_especie} value={String(esp.id_especie)}>
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
              disabled={!especieSeleccionada}
            >
              <option value="">Raza</option>
              {listaRazas.map((r) => (
                <option key={r.id_raza} value={String(r.id_raza)}>
                  {r.nombre_raza}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

        </div>

        <div className="text-center mt-4">
          <Button type="submit">Guardar</Button>
          <Button onClick={onClose} className="ms-2" variant="danger">
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMascota;