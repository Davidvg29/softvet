import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { clientes } from '../../endpoints/endpoints';
import validationCrearClientes from '../../validations/validationCrearClientes';
import { useEmpleadoStore } from '../../zustand/empleado';

function CrearCliente({ onClose, onUpdate }) {
  
  const empleadoStore = useEmpleadoStore((state) => state.empleado);

  const initialState = {
    nombre_cliente: "",
    dni_cliente: "",
    direccion_cliente: "",
    celular_cliente: "",
    mail_cliente: ""
  };
  
  const [formData, setFormdata] = useState(initialState);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log("FormData antes de validar:", formData);

    const validation = validationCrearClientes(
  formData.nombre_cliente,
  formData.dni_cliente,
  formData.direccion_cliente,
  formData.celular_cliente,
  formData.mail_cliente
);

if (validation.length !== 0) {
    return Swal.fire({
      icon: "warning",
      title: "Atención",
      text: validation,
      confirmButtonColor: "#6f42c1",
    });
  }


  const datosFinales = {
      ...formData,
      id_empleado: empleadoStore?.id_empleado 
    };
// console.log("🟣 Datos enviados:", datosFinales);
    try {
      const response = await axios.post(`${clientes}/crear`, datosFinales, { withCredentials: true });
      // console.log(response.data);
      
      if (response.status === 200 || response.status === 201) {

        await Swal.fire({
          icon: 'success',
          title: '¡Cliente guardado con éxito!',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        setFormdata(initialState);
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
  console.error("Error al guardar Cliente:", error);

  const msg =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Hubo un problema al guardar el Cliente.";

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
            <Form.Label><strong>Nombre:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>DNI:</strong></Form.Label>
            <Form.Control
              type="text"
              name="dni_cliente"
              value={formData.dni_cliente}
              onChange={handleChange}
              placeholder="DNI del cliente"
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
            <Form.Label><strong>Dirección:</strong></Form.Label>
            <Form.Control
              type="text"
              name="direccion_cliente"
              value={formData.direccion_cliente}
              onChange={handleChange}
              placeholder="Dirección del cliente"
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
            <Form.Label><strong>Teléfono:</strong></Form.Label>
            <Form.Control
              type="text"
              name="celular_cliente"
              value={formData.celular_cliente}
              onChange={handleChange}
              placeholder="Teléfono del cliente"
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
            <Form.Label><strong>Mail:</strong></Form.Label>
            <Form.Control
              type="email"
              name="mail_cliente"
              value={formData.mail_cliente}
              onChange={handleChange}
              placeholder="Email del cliente"
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

export default CrearCliente

