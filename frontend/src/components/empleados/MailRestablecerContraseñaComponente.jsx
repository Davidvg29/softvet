import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { empleados } from '../../endpoints/endpoints';

const MailRestablecerContraseñaComponente = () => {

  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);

  const handleMail = (e) => {
    setMessage("");
    setMail(e.target.value);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendMail = async (e) => {
    e.preventDefault();

    if (mail.trim() === "") {
      setMessage("El correo no puede estar vacío.");
      return;
    }

    if (!validateEmail(mail)) {
      setMessage("Ingrese un correo electrónico válido.");
      return;
    }

    if (!checked) {
      setMessage("Por favor, confirme que no es un robot.");
      return;
    }

    try {
        setMessage("Enviando...");
      const { data } = await axios.get(`${empleados}/password/restablecer/${mail}`);
      setMessage(data);
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
          onSubmit={sendMail}
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
            Escriba su correo electrónico y se le enviará un enlace para restablecer su contraseña.
          </p>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-semibold text-white">Correo electrónico:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              name="mail"
              onChange={handleMail}
              value={mail}
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
              Enviar enlace
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

export default MailRestablecerContraseñaComponente;
