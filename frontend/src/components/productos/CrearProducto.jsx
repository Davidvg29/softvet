import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { productos, categorias } from '../../endpoints/endpoints';
import validationCrearProductos from '../../validations/validationCrearProductos';
import { useEmpleadoStore } from '../../zustand/empleado';

function CrearProducto({ onClose, onUpdate }) {
  const {empleado} = useEmpleadoStore()
  const initialState = {
    nombre_producto: "",
    codigo_producto: "",
    precio_producto: "",
    id_categoria: "",
    id_empleado: empleado ? empleado.id_empleado : null,
  };
  const [formData, setFormdata] = useState(initialState);
  const [categoria, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${categorias}/ver`, { withCredentials: true });
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al cargar las Categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("FormData antes de validar:", formData);

    const validation = validationCrearProductos(
  formData.nombre_producto,
  formData.codigo_producto,
  formData.precio_producto,
  formData.id_categoria
);

if (validation.length !== 0) {
    return Swal.fire({
      icon: "warning",
      title: "Atención",
      text: validation,
      confirmButtonColor: "#6f42c1",
    });
  }

console.log("🟣 Datos enviados:", formData);
    try {
      const response = await axios.post(`${productos}/crear`, formData, { withCredentials: true });
      console.log(response.data);
      
      if (response.status === 200 || response.status === 201) {

        await Swal.fire({
          icon: 'success',
          title: '¡Producto guardado con éxito!',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        setFormdata(initialState);
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
  console.error("Error al guardar el Producto:", error);

  const msg =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Hubo un problema al guardar el Producto.";

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
            <Form.Label><strong>Nombre Producto:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              placeholder="Nombre del Producto"
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
            <Form.Label><strong>Código Producto:</strong></Form.Label>
            <Form.Control
              type="text"
              name="codigo_producto"
              value={formData.codigo_producto}
              onChange={handleChange}
              placeholder="Código del Producto"
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
            <Form.Label><strong>Precio Producto:</strong></Form.Label>
            <Form.Control
              type="text"
              name="precio_producto"
              value={formData.precio_producto}
              onChange={handleChange}
              placeholder="Precio del Producto"
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
            <Form.Label><strong>Categoria:</strong></Form.Label>
            <Form.Select
              name="id_categoria"
              value={formData.id_categoria}
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
              <option value="">Seleccionar una Categoria</option>
              {categoria.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre_categoria}
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
            type="button" onClick={handleSubmit}
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
}

export default CrearProducto

