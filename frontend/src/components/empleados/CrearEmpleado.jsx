import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { empleados, ROLES } from '../../endpoints/endpoints';
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

    // console.log("FormData antes de validar:", formData);

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

    // console.log("🟣 Datos enviados:", formData);
    try {
      const response = await axios.post(`${empleados}/crear`, formData, { withCredentials: true });
      // console.log(response.data);

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
            <Form.Label><strong>Contraseña:</strong></Form.Label>
            <Form.Control
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Contraseña del empleado"
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
            <Form.Label><strong>Nombre:</strong></Form.Label>
            <Form.Control
              type="text"
              name="nombre_empleado"
              value={formData.nombre_empleado}
              onChange={handleChange}
              placeholder="Nombre del empleado"
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
            <Form.Label><strong>DNI:</strong></Form.Label>
            <Form.Control
              type="text"
              name="dni_empleado"
              value={formData.dni_empleado}
              onChange={handleChange}
              placeholder="DNI del empleado"
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
              name="direccion_empleado"
              value={formData.direccion_empleado}
              onChange={handleChange}
              placeholder="Dirección del empleado"
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
              name="telefono_empleado"
              value={formData.telefono_empleado}
              onChange={handleChange}
              placeholder="Teléfono del empleado"
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
              name="mail_empleado"
              value={formData.mail_empleado}
              onChange={handleChange}
              placeholder="Email del empleado"
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
            <Form.Label><strong>Rol:</strong></Form.Label>
            <Form.Select
              name="id_rol"
              value={formData.id_rol}
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

export default CrearEmpleado

