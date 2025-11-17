import { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { mascotas } from "../../endpoints/endpoints";

const VerMascota = ({ id_mascota }) => {
  const [mascota, setMascota] = useState(null);

  useEffect(() => {
    if (!id_mascota) return;

    const fetchMascota = async () => {
      try {
        const { data } = await axios.get(`${mascotas}/ver/${id_mascota}`, {
          withCredentials: true,
        });
        setMascota(data);
      } catch (error) {
        console.error("Error carga mascota:", error);
      }
    };

    fetchMascota();
  }, [id_mascota]);

  if (!mascota)
    return (
      <div className="text-center">
        <Spinner /> <p>Cargando mascota...</p>
      </div>
    );

  return (
    <Card className="p-4 shadow">
      <h4 className="text-center mb-3">{mascota.nombre_mascota}</h4>

      <p><strong>Edad:</strong> {mascota.edad}</p>
      <p><strong>Sexo:</strong> {mascota.sexo}</p>
      <p><strong>Raza:</strong> {mascota.nombre_raza}</p>
      <p><strong>Especie:</strong> {mascota.nombre_especie}</p>
      <p><strong>ID Cliente:</strong> {mascota.id_cliente}</p>
    </Card>
  );
};

export default VerMascota;