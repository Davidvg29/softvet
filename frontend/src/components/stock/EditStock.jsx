import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { STOCK, productos } from "../../endpoints/endpoints";
import { useEmpleadoStore } from "../../zustand/empleado";

const EditStock = ({ id_stock, onClose, onUpdate }) => {
  const {empleado} = useEmpleadoStore()
  const initialState = {
    id_producto: "",
    cantidad: "",
    observaciones_stock: "",
    id_sucursal: 1,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);

  // Cargar datos del stock actual
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data } = await axios.get(`${STOCK}/verStock/${id_stock}`, {
          withCredentials: true,
        });

        const nombreProducto = await axios.get(`${productos}/ver/${data.id_producto}`, {
        withCredentials: true,
      });

        setFormData({
          id_producto: data.id_producto,
          cantidad: data.cantidad,
          observaciones_stock: data.observaciones_stock || "",
          id_sucursal: data.id_sucursal,
          nombre_producto: nombreProducto.data.nombre_producto,
          id_empleado: empleado ? empleado.id_empleado : null,
        });
      } catch (error) {
        console.error("Error al cargar el stock:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del stock.",
          confirmButtonColor: "#6f42c1",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_stock]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cantidad || isNaN(formData.cantidad) || Number(formData.cantidad) < 0) {
      return Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "La cantidad debe ser un número válido.",
        confirmButtonColor: "#6f42c1",
      });
    }

    try {
      const payload = {
        id_producto: Number(formData.id_producto),
        cantidad: Number(formData.cantidad),
        observaciones_stock: formData.observaciones_stock || null,
        id_sucursal: Number(formData.id_sucursal),
        id_empleado: empleado?.id_empleado,
      };

      const response = await axios.put(`${STOCK}/editar/${id_stock}`, payload, {
        withCredentials: true,
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Stock actualizado",
          text: "Los datos del stock fueron modificados correctamente.",
          confirmButtonColor: "#6f42c1",
        });

        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error al editar el stock:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el stock. Intente nuevamente.",
        confirmButtonColor: "#6f42c1",
      });
    }
  };


  if (loading)
    return <p>Cargando datos...</p>;

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

          {/* Producto (no editable) */}
          <Form.Group>
            <Form.Label>
              <strong>Producto:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre_producto || "Cargando..."}
              disabled
              style={{ borderRadius: "8px", background: "#e9ecef" }}
            />
          </Form.Group>

          {/* Cantidad */}
          <Form.Group>
            <Form.Label>
              <strong>Cantidad:</strong>
            </Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
              min="0"
            />
          </Form.Group>

          {/* Observaciones */}
          <Form.Group style={{ gridColumn: "1 / span 2" }}>
            <Form.Label>
              <strong>Observaciones:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones_stock"
              value={formData.observaciones_stock}
              onChange={handleChange}
              placeholder="Notas sobre este ingreso"
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
            Guardar Cambios
          </Button>

          <Button
            type="button"
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

export default EditStock;
