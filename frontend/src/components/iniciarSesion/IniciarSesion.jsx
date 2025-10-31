import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { empleado } from '../../endpoints/endpoints';
import { useEmpleadoStore } from '../../zustand/empleado';

const IniciarSesion = () => {
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
      const { data } = await axios.post(`${empleado}/autenticar`, user);
      console.log(data);
      setEmpleado(data.empleado); // ✅ guarda el empleado globalmente
      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage("Credenciales incorrectas.");
    }
  };

  return (
    <Form onSubmit={sendUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Usuario:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese su usuario"
          name="usuario"
          onChange={handlerUser}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="******"
          name="contrasena"
          onChange={handlerUser}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="No soy un robot."
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Iniciar Sesión
      </Button>
      <p>{message}</p>
    </Form>
  );
};

export default IniciarSesion;
