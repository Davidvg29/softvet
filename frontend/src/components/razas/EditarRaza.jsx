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
                backgroundColor: "#cfcfcf",
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

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button
                        type="submit"
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
                            transform: "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #3c5bb3";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 0 #3c5bb3";
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = "translateY(2px)";
                            e.target.style.boxShadow = "0 2px 0 #3c5bb3";
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #3c5bb3";
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
                            transform: "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #b33a2b";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 0 #b33a2b";
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = "translateY(2px)";
                            e.target.style.boxShadow = "0 2px 0 #b33a2b";
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #b33a2b";
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