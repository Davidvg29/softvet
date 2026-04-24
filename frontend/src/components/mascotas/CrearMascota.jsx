import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { mascotas, ESPECIES, razas } from "../../endpoints/endpoints";
import validationCrearMascotas from "../../validations/validationCrearMascotas";
import { useEmpleadoStore } from "../../zustand/empleado";

const CrearMascota = ({ id_cliente, onClose, onUpdate }) => {
  const {empleado} = useEmpleadoStore()
  const initialState = {
    nombre_mascota: "",
    edad_mascota: "",
    sexo_mascota: "",
    id_raza: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [listaEspecies, setListaEspecies] = useState([]);
  const [listaRazas, setListaRazas] = useState([]);
  const [especieSeleccionada, setEspecieSeleccionada] = useState("");

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

  // Cargar razas según especie seleccionada
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

    // 🔎 Validar datos
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

    // Enviar datos al backend
    try {
      const response = await axios.post(
        `${mascotas}/crear`,
        { ...formData, id_cliente, id_empleado: empleado?.id_empleado },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "¡Mascota creada con éxito!",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#6f42c1",
        });

        setFormData(initialState);
        setEspecieSeleccionada("");
        setListaRazas([]);

        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error al crear mascota:", error);

      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Hubo un problema al crear la mascota.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div
      style={{
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
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Sexo:</strong></Form.Label>
            <Form.Select
              name="sexo_mascota"
              value={formData.sexo_mascota}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <Button
            type="submit"
            style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
            }}
          >
            Guardar
          </Button>

          <Button
            onClick={onClose}
            style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CrearMascota;