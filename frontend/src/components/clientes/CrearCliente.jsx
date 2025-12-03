import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { clientes } from '../../endpoints/endpoints';
import validationCrearClientes from '../../validations/validationCrearClientes';

function CrearCliente({ onClose, onUpdate }) {
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
    
    console.log("FormData antes de validar:", formData);

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

console.log("🟣 Datos enviados:", formData);
    try {
      const response = await axios.post(`${clientes}/crear`, formData, { withCredentials: true });
      console.log(response.data);
      
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
            />
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

export default CrearCliente

