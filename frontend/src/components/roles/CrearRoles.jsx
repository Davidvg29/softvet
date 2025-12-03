import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { ROLES } from '../../endpoints/endpoints';
import validationCrearRoles from '../../validations/validationCrearRoles';

function CrearRoles({ onClose, onUpdate }) {
  const initialState = {
    nombre_rol: ""
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
    console.log("🟣 handleSubmit ejecutado");

    const validation = validationCrearRoles(formData.nombre_rol);
    if (validation.length !== 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: validation,
        confirmButtonText: 'Aceptar',
      });
    }

    try {
      const response = await axios.post(`${ROLES}/crear`, formData, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {

        await Swal.fire({
          icon: 'success',
          title: '¡Rol guardado con éxito!',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        setFormdata(initialState);
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error al guardar Rol", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el rol.',
        confirmButtonText: 'Aceptar',
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
        <Form.Group className="mb-3">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Form.Label style={{ margin: 0, whiteSpace: "nowrap" }}>
              <strong>Nombre:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre_rol"
              value={formData.nombre_rol}
              onChange={handleChange}
              placeholder="Nombre del rol"
              style={{ borderRadius: "8px", flex: 1 }}
            />
          </div>
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
  );
}

export default CrearRoles
