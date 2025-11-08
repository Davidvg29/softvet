import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import validationProveedores from '../../validations/validationsProveedores';
import { proveedores } from '../../endpoints/endpoints';


const CrearProveedor = ({ onClose, onUpdated }) => {
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
    <div className="bg-white p-4 rounded-3 shadow text-dark w-100 " >
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

        <div className="text-center mt-4">
          <Button variant="danger" className="me-3" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default CrearProveedor