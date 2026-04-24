import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { categorias } from "../../endpoints/endpoints";
import validationCrearCategorias from "../../validations/validationCrearCategorias";

const EditCategorias = ({ id_categoria, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ nombre_categoria: "" });

  // 🔹 Cargar datos de la especie al montar el componente
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`${categorias}/ver/${id_categoria}`, {
          withCredentials: true,
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error al obtener la Categoria", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la categoria.",
          confirmButtonColor: "#6f42c1",
        });
      }
    };

    if (id_categoria) fetchCategoria();
  }, [id_categoria]);

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

    const validation = validationCrearCategorias(formData.nombre_categoria);
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
        `${categorias}/editar/${id_categoria}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Categoria actualizada",
          text: "Los cambios se guardaron correctamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#6f42c1",
        });

        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error al editar la categoria:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la categoria. Inténtalo nuevamente.",
        confirmButtonColor: "#6f42c1",
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
          <Form.Group className="mb-3">
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <Form.Label style={{ margin: 0, whiteSpace: "nowrap" }}>
      <strong>Nombre:</strong>
    </Form.Label>
    <Form.Control
      type="text"
      name="nombre_categoria"
      value={formData.nombre_categoria}
      onChange={handleChange}
      placeholder="Nombre de la categoria"
      style={{ borderRadius: "8px", flex: 1 }}
      onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
    />
  </div>
</Form.Group>

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
            Guardar Cambios
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
}

export default EditCategorias;