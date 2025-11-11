import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { EMPLEADOS, ROLES } from '../../endpoints/endpoints';
import validationCrearEmpleados from '../../validations/validationCrearEmpleados';

function CrearEmpleado({ onClose, onUpdate }) {
  const initialState = {
    usuario: "",
    contrasena: "",
    nombre_empleado: "",
    dni_empleado: "",
    direccion_empleado: "",
    telefono_empleado: "",
    mail_empleado: "",
    id_rol: ""
  };
  const [formData, setFormdata] = useState(initialState);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${ROLES}/ver`, { withCredentials: true });
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
      }
    };
    fetchRoles();
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

    const validation = validationCrearEmpleados(
  formData.usuario,
  formData.contrasena,
  formData.nombre_empleado,
  formData.dni_empleado,
  formData.direccion_empleado,
  formData.telefono_empleado,
  formData.mail_empleado,
  formData.id_rol
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
      const response = await axios.post(`${EMPLEADOS}/crear`, formData, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {

        await Swal.fire({
          icon: 'success',
          title: '¡Empleado guardado con éxito!',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#6f42c1',
        });

        setFormdata(initialState);
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      }
    } catch (error) {
  console.error("Error al guardar Empleado:", error);

  const msg =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Hubo un problema al guardar el empleado.";

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
            <Form.Label><strong>Usuario:</strong></Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Usuario del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Contraseña:</strong></Form.Label>
            <Form.Control
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Contraseña del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Nombre:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_empleado"
              value={formData.nombre_empleado}
              onChange={handleChange}
              placeholder="Nombre del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>DNI:</strong></Form.Label>
            <Form.Control
              type="text"
              name="dni_empleado"
              value={formData.dni_empleado}
              onChange={handleChange}
              placeholder="DNI del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Dirección:</strong></Form.Label>
            <Form.Control
              type="text"
              name="direccion_empleado"
              value={formData.direccion_empleado}
              onChange={handleChange}
              placeholder="Dirección del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Teléfono:</strong></Form.Label>
            <Form.Control
              type="text"
              name="telefono_empleado"
              value={formData.telefono_empleado}
              onChange={handleChange}
              placeholder="Teléfono del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Mail:</strong></Form.Label>
            <Form.Control
              type="email"
              name="mail_empleado"
              value={formData.mail_empleado}
              onChange={handleChange}
              placeholder="Email del empleado"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><strong>Rol:</strong></Form.Label>
            <Form.Select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Seleccionar un rol</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre_rol}
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

export default CrearEmpleado

