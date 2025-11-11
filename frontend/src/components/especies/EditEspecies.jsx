import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { ESPECIES } from "../../endpoints/endpoints";
import validationCrearEspecies from "../../validations/validationCrearEspecies";

const EditEspecies = ({ id_especie, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ nombre_especie: "" });

  // 🔹 Cargar datos de la especie al montar el componente
  useEffect(() => {
    const fetchEspecie = async () => {
      try {
        const response = await axios.get(`${ESPECIES}/ver/${id_especie}`, {
          withCredentials: true,
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error al obtener la especie:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la especie.",
          confirmButtonColor: "#6f42c1",
        });
      }
    };

    if (id_especie) fetchEspecie();
  }, [id_especie]);

  // 🔹 Actualizar campo al escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validationCrearEspecies(formData.nombre_especie);
    if (validation.length !== 0) {
      return Swal.fire({
        icon: "warning",
        title: "Atención",
        text: validation,
        confirmButtonColor: "#6f42c1",
      });
    }

    try {
      const response = await axios.put(
        `${ESPECIES}/editar/${id_especie}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Especie actualizada",
          text: "Los cambios se guardaron correctamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#6f42c1",
        });

        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error al editar la especie:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la especie. Inténtalo nuevamente.",
        confirmButtonColor: "#6f42c1",
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
          <Form.Group className="mb-3">
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <Form.Label style={{ margin: 0, whiteSpace: "nowrap" }}>
      <strong>Nombre:</strong>
    </Form.Label>
    <Form.Control
      type="text"
      name="nombre_especie"
      value={formData.nombre_especie}
      onChange={handleChange}
      placeholder="Nombre del especie"
      style={{ borderRadius: "8px", flex: 1 }}
    />
  </div>
</Form.Group>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
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
    transform: "translateY(0)",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 0 #3c5bb3";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 0 #3c5bb3";
  }}
  onMouseDown={(e) => {
    e.target.style.transform = "translateY(2px)";
    e.target.style.boxShadow = "0 2px 0 #3c5bb3";
  }}
  onMouseUp={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 0 #3c5bb3";
  }}
>
  Guardar Cambios
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
    transform: "translateY(0)",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 0 #b33a2b";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 0 #b33a2b";
  }}
  onMouseDown={(e) => {
    e.target.style.transform = "translateY(2px)";
    e.target.style.boxShadow = "0 2px 0 #b33a2b";
  }}
  onMouseUp={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 0 #b33a2b";
  }}
>
  Cancelar
</Button>
          </div>
        </Form>
      </div>  
  );
}

export default EditEspecies;