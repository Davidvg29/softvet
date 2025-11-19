import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { clientes } from "../../endpoints/endpoints";
import validationCrearClientes from "../../validations/validationCrearClientes";

const EditCliente = ({ id_cliente, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ 
    nombre_cliente: "", 
    dni_cliente: "", 
    direccion_cliente: "", 
    celular_cliente: "", 
    mail_cliente: ""
  });

  
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`${clientes}/ver/${id_cliente}`, {
          withCredentials: true,
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error al obtener el cliente:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el cliente.",
          confirmButtonColor: "#6f42c1",
        });
      }
    };

    if (id_cliente) fetchCliente();
  }, [id_cliente]);


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const response = await axios.put(
        `${clientes}/editar/${id_cliente}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Cliente actualizado",
          text: "Los cambios se guardaron correctamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#6f42c1",
        });

        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error al editar el cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el cliente. Inténtalo nuevamente.",
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
        placeholder="celular del cliente"
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

  
  <div style={{ textAlign: "center", marginTop: "25px" }}>
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
      }}
    >
      Cancelar
    </Button>
  </div>
</Form>
      </div>
  )
}

export default EditCliente
