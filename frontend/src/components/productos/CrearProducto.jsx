import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { productos, categorias } from '../../endpoints/endpoints';
import validationCrearProductos from '../../validations/validationCrearProductos';

function CrearProducto({ onClose, onUpdate }) {
  const initialState = {
    nombre_producto: "",
    codigo_producto: "",
    precio_producto: "",
    id_categoria: ""
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
            <Form.Label><strong>Nombre Producto:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              placeholder="Nombre del Producto"
              style={{ borderRadius: "8px" }}
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
            />
          </Form.Group>


          <Form.Group>
            <Form.Label><strong>Categoria:</strong></Form.Label>
            <Form.Select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
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
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Button
            type="button" onClick={handleSubmit}
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
}

export default CrearProducto

