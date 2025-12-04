import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { empleados } from '../../endpoints/endpoints';
import { useNavigate, useParams } from 'react-router-dom';

const RestablecerContraseñaComponente = () => {

  const { token } = useParams();

  const navigate = useNavigate();

  const [contraseña, setContraseña] = useState({
    nuevaContraseña: "",
    nuevaContraseñaRepetida: ""
  });

  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);

  const handleContraseña = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setContraseña(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendContraseña = async (e) => {
    e.preventDefault();

    if (!checked) {
      setMessage("Por favor, confirme que no es un robot.");
      return;
    }

    if (contraseña.nuevaContraseña !== contraseña.nuevaContraseñaRepetida) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setMessage("Cambiando contraseña...");

      const { data } = await axios.post(
        `${empleados}/password/restablecer`,
        {
          token: token,
          nuevaContraseña: contraseña.nuevaContraseña
        }
      );

      setMessage(data + ', Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data);
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: '80vh',
          background: 'white',
          padding: "20px",
        }}
      >
        <Form
          onSubmit={sendContraseña}
          className="p-4 shadow-lg"
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)",
            backdropFilter: "blur(12px)",
            borderRadius: "18px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: "fadeIn 0.7s ease-out",
          }}
        >
          <h3 className="text-center mb-3 fw-bold text-white">
            Restablecimiento de Contraseña
          </h3>
          <p className="text-center text-white-50 mb-4">
            Escriba su nueva contraseña y confirme para restablecerla.
          </p>

          {/* Nueva contraseña */}
          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-semibold text-white">
              Nueva contraseña:
            </Form.Label>
            <Form.Control
              type="password"
              name="nuevaContraseña"
              placeholder="Ingrese su nueva contraseña"
              onChange={handleContraseña}
              value={contraseña.nuevaContraseña}
              style={{
                borderRadius: "10px",
                padding: "10px",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.25)",
                color: "white",
              }}
            />
          </Form.Group>

          {/* Repetir contraseña */}
          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-semibold text-white">
              Repita su nueva contraseña:
            </Form.Label>
            <Form.Control
              type="password"
              name="nuevaContraseñaRepetida"
              placeholder="Repita su nueva contraseña"
              onChange={handleContraseña}
              value={contraseña.nuevaContraseñaRepetida}
              style={{
                borderRadius: "10px",
                padding: "10px",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.25)",
                color: "white",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start">
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
            >
              Restablecer Contraseña
            </Button>
          </div>

          <p className="text-center mt-3 text-white fw-semibold">{message}</p>
        </Form>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default RestablecerContraseñaComponente;
