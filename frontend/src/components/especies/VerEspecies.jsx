import { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { URL_ESPECIES } from '../../../Constants/endpoints';

const MainEspecie = () => {
  const [especies, setEspecies] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarEspecies = async () => {
    try {
      const response = await axios.get(URL_ESPECIES);
      setEspecies(response.data);
    } catch (error) {
      console.error("Error al cargar especies:", error);
    }
  };

  useEffect(() => {
    cargarEspecies();
  }, []);

  const especiesFiltradas = especies.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.codigo.toString().includes(busqueda)
  );

  return (
    <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">
      <div className="d-flex justify-content-center align-items-center m-3 w-75">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o código"
          className="w-50 mx-3"
          style={{ width: '700px' }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button
          variant="light"
          style={{ backgroundColor: "rgba(63, 3, 175, 0.5)", color: "#fff" }}
          onClick={() => alert("Abrir modal para crear especie")}
        >
          Crear una nueva Especie
        </Button>
      </div>

      <Table striped bordered hover responsive size="sm" style={{ width: '700px' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          {especiesFiltradas.length > 0 ? (
            especiesFiltradas.map((e) => (
              <tr key={e.id}>
                <td>{e.nombre}</td>
                <td>{e.codigo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No se encontraron especies.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MainEspecie;

// Corregir