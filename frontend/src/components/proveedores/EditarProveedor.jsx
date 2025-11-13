import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import { proveedores } from '../../endpoints/endpoints';
import validationProveedores from '../../validations/validationsProveedores';

const EditarProveedor = ({ id, onClose, onUpdated }) => {
  const [proveedor, setProveedor] = useState({
    nombre_proveedor: "",
    direccion_proveedor: "",
    celular_proveedor: "",
    mail_proveedor: ""
  });

  useEffect(() => {
    if (!id) return;

    const cargarProveedor = async () => {
      try {
        const response = await axios.get(`${proveedores}/ver/${id}`, { withCredentials: true });
        setProveedor(response.data);
      } catch (error) {
        console.error("Error al obtener el proveedor:", error);
      }
    };
    cargarProveedor();
  }, [id]);


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
      const response = await axios.put(`${proveedores}/editar/${id}`, proveedor, { withCredentials: true });
      console.log("proveedor editado correctamente", response.data);
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
      <h3 className="text-center mb-4">Formulario de proveedors</h3>
      <Form className="px-5" onSubmit={handleSubmit} >
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Nombre</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="nombre_proveedor" placeholder="Nombre del proveedor" value={proveedor.nombre_proveedor || ''} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Direccion</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="direccion_proveedor" placeholder="Direccion del proveedor" value={proveedor.direccion_proveedor || ''} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Celular</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="celular_proveedor" placeholder="Celular del proveedor" value={proveedor.celular_proveedor || ''} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column sm="3" className="text-end fw-bold">Mail</Form.Label>
          <Col sm="9">
            <Form.Control type="text" name="mail_proveedor" placeholder="Mail del proveedor" value={proveedor.mail_proveedor || ''} onChange={handleChange} />
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
    </div >
  )
}

export default EditarProveedor