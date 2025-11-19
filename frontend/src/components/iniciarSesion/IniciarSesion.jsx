import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { empleados } from '../../endpoints/endpoints';
import { useEmpleadoStore } from '../../zustand/empleado';
import { useNavigate } from 'react-router-dom';

const IniciarSesion = () => {
  const navigate = useNavigate();
  const empleado = useEmpleadoStore((state) => state.empleado); 
  const { setEmpleado } = useEmpleadoStore();
  const [user, setUser] = useState({ usuario: "", contrasena: "" });
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);

  const handlerUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendUser = async (e) => {
    e.preventDefault();
    if (!checked) {
      setMessage("Por favor, confirme que no es un robot.");
      return;
    }
    try {
      const { data } = await axios.post(`${empleados}/autenticar`, user, { withCredentials: true });
      setEmpleado(data.empleado);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setMessage("Credenciales incorrectas.");
    }
  };

  useEffect(() => {
    if (empleado) navigate("/dashboard");
  }, []);

  return (
    <div 
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)',
        padding: "20px",
      }}
    >
      <Form
        onSubmit={sendUser}
        className="p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "18px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          animation: "fadeIn 0.7s ease-out",
        }}
      >
        <h3 className="text-center mb-3 fw-bold text-white">
          Bienvenido a SoftVet
        </h3>
        <p className="text-center text-white-50 mb-4">
          Inicie sesión para continuar
        </p>

        <Form.Group className="mb-3 text-start" controlId="formBasicEmail">
          <Form.Label className="fw-semibold text-white">Usuario:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su usuario"
            name="usuario"
            onChange={handlerUser}
            style={{
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.25)",
              color: "white",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3 text-start" controlId="formBasicPassword">
          <Form.Label className="fw-semibold text-white">Contraseña:</Form.Label>
          <Form.Control
            type="password"
            placeholder="******"
            name="contrasena"
            onChange={handlerUser}
            style={{
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.25)",
              color: "white",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3 text-start" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="No soy un robot."
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="text-white"
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button
            type="submit"
            className="w-75 fw-bold"
            style={{
              background: "linear-gradient(135deg, #6d3bd2 0%, #a56bf4 100%)",
              border: "none",
              padding: "12px",
              borderRadius: "12px",
              transition: "0.3s",
              boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 5px 12px rgba(0,0,0,0.2)";
            }}
          >
            Iniciar Sesión
          </Button>
        </div>

        <p className="text-center mt-3 text-white fw-semibold">{message}</p>
      </Form>

      {/* Animación */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
};

export default IniciarSesion;