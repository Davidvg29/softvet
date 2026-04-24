import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { razas } from '../../endpoints/endpoints';
import { ESPECIES } from '../../endpoints/endpoints';
import validationCrearRaza from '../../validations/validationCrearRaza';
const EditarRaza = ({ id, onClose, onUpdated }) => {
   
    const initialState = {
        nombre_raza: ""
    };
    const [especies, setEspecies] = useState([]);
    const [formData, setFormdata] = useState(initialState);

    const cargarRazas = async () => {
        try {

            const { data } = await axios.get(`${razas}/ver/${id}`, { withCredentials: true });
            console.log(data);
            setFormdata(data);
        } catch (error) {
            console.error("Error al cargar las razas:", error);
        }
    };

    useEffect(() => {
        cargarRazas();
    }, []);

    const cargarEspecies = async () => {
        try {

            const { data } = await axios.get(`${ESPECIES}/ver`, { withCredentials: true });
            console.log(data);
            setEspecies(data);
        } catch (error) {
            console.error("Error al cargar las especies:", error);
        }
    };

    useEffect(() => {
        cargarEspecies();
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
        console.log("🟣 handleSubmit ejecutado");

        const validation = validationCrearRaza(formData.nombre_raza);
        if (validation.length !== 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Validación',
                text: validation,
                confirmButtonText: 'Aceptar',
            });
        }

        try {
            const response = await axios.put(`${razas}/editar/${id}`, formData, { withCredentials: true });

            if (response.status === 200 || response.status === 201) {

                await Swal.fire({
                    icon: 'success',
                    title: 'Raza guardada con éxito!',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#6f42c1',
                });

                setFormdata(initialState);
                if (response) {
                    onUpdated();
                    onClose();
                }

            }

        } catch (error) {
            console.error("Error al guardar Raza", error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar la Raza.',
                confirmButtonText: 'Aceptar',
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
                <Form.Group className="mb-3">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Form.Label style={{ margin: 0, whiteSpace: "nowrap" }}>
                            <strong>Nombre:</strong>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre_raza"
                            value={formData.nombre_raza || ''}
                            onChange={handleChange}
                            placeholder="Nombre de la raza"
                            style={{ borderRadius: "8px", flex: 1 }}
                            onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
                        />
                    </div>
                </Form.Group>
                <Form.Group>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Form.Label style={{ margin: 0, whiteSpace: "nowrap" }}><strong>Especie:</strong></Form.Label>
                        <Form.Select
                            name="id_especie"
                            value={formData.id_especie || ''}
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
                            <option value="">Seleccionar una especie</option>
                            {especies.map((especie) => (
                                <option key={especie.id_especie} value={especie.id_especie}>
                                    {especie.nombre_especie}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </Form.Group>

                <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <Button
                        type="submit"
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

export default EditarRaza