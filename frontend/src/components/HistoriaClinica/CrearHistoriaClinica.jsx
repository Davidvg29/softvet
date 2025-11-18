import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import validationProveedores from '../../validations/validationsProveedores';
import { historiasClinicas } from '../../endpoints/endpoints';

const CrearHistoriaClinica = () => {
  const [proveedor, setProveedor] = useState({
    nombre_proveedor: "",
    direccion_proveedor: "",
    celular_proveedor: "",
    mail_proveedor: ""
  });


  const handleChange = (e) => {
    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validationProveedores(proveedor);
    if (validation.length != 0) {
      return alert(validation)
    }

    try {
      const response = await axios.post(`${proveedores}/crear`, proveedor, { withCredentials: true });
      console.log("proveedor creado correctamente", response.data);
      setProveedor({
        nombre_proveedor: "",
        direccion_proveedor: "",
        celular_proveedor: "",
        mail_proveedor: ""
      });
      if (response) {
        onUpdated();
        onClose();
      }

    } catch (error) {
      console.error("Error al crear el proveedor:", error);
    }

  };

  return (
    <div style={{
      backgroundColor: "#cfcfcf",
      borderRadius: "10px",
      padding: "25px 40px",
      color: "#000",
    }}>
      <h3 className="text-center mb-4">Formulario de proveedores</h3>
      <Form className="px-5" onSubmit={handleSubmit} >
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Nombre</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="nombre_proveedor" placeholder="Nombre del proveedor" value={proveedor.nombre_proveedor} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Direccion</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="direccion_proveedor" placeholder="Direccion del proveedor" value={proveedor.direccion_proveedor} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Celular</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="celular_proveedor" placeholder="Celular del proveedor" value={proveedor.celular_proveedor} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Mail</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="mail_proveedor" placeholder="Mail del proveedor" value={proveedor.mail_proveedor} onChange={handleChange} />
          </Col>
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
  )
}

export default CrearHistoriaClinica