import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { empleados } from '../../endpoints/endpoints';
import { useEmpleadoStore } from '../../zustand/empleado';
import { Navigate, useNavigate } from 'react-router-dom';

const IniciarSesion = () => {
  const navigate = useNavigate()
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
      const { data } = await axios.post(`${empleados}/autenticar`, user, {withCredentials: true});
      console.log(data);
      setEmpleado(data.empleado); // ✅ guarda el empleado globalmente
      console.log(data.empleado)
      setMessage(data.message);
      navigate("/dashboard")
    } catch (error) {
      console.log(error);
      setMessage("Credenciales incorrectas.");
    }
  };

  useEffect(()=>{
    if(empleado){
      navigate("/dashboard")
    }
  }, [])

  return (
   <div className="d-flex justify-content-center " style={{ minHeight: '75vh' }}>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6">
        <Form onSubmit={sendUser} className="p-4 border rounded shadow-sm bg-white">
          
          <Form.Group className="mb-3 text-start" controlId="formBasicEmail">
            <Form.Label className="fw-semibold">Usuario:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su usuario"
              name="usuario"
              onChange={handlerUser}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start" controlId="formBasicPassword">
            <Form.Label className="fw-semibold">Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              name="contrasena"
              onChange={handlerUser}
            />
          </Form.Group>

          <div className="d-flex flex-column align-items-center">
            <Form.Group className="mb-3 text-start w-100" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="No soy un robot."
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-50">
              Iniciar Sesión
            </Button>
          </div>

          <p className="text-center mt-3">{message}</p>
        </Form>
      </div>
    </div>
  </div>
</div>

  );
};

export default IniciarSesion;
