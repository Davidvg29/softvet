import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
import { proveedores } from '../../endpoints/endpoints';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import VerProveedor from './VerProveedor';
import CrearProveedor from './CrearProveedor';
import EditarProveedor from './EditarProveedor';
import { X } from "lucide-react"; 

const MainProveedores = () => {


    //state de busqueda
    const [busqueda, setBusqueda] = useState("");

    const [proveedor, setProveedor] = useState([]);

    const [proveedorId, setProveedorId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [fromType, setFromType] = useState("");

    //funcion de apertura modal
    const handleOpenModal = (type, id = null) => {
        setFromType(type);
        setProveedorId(id);
        setShowModal(true);
    };

    //funcion de cierre de la modal
    const handleCloseModal = (type) => {
        setShowModal(false);
        setFromType("");
    };

    const TITULOS = {

        crearProveedor: "Crear Proveedor",
        verProveedor: "Ver Proveedor",
        editarProveedor: "Editar Proveedor",
    };

    const cargarProveedores = async () => {
        try {

            const { data } = await axios.get(`${proveedores}/ver`, { withCredentials: true });
            console.log(data);
            setProveedor(data);
        } catch (error) {
            console.error("Error al cargar los proveedores:", error);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, []);

    const proveedoresFiltrados = proveedor.filter((proveedor) =>
        proveedor.nombre_proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedor.mail_proveedor.toLowerCase().includes(busqueda.toLowerCase())

    );

    const borrar = async (id_proveedor) => {
        const result = await Swal.fire({
            title: "¿Eliminar proveedor?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${proveedores}/eliminar/${id_proveedor}`, { withCredentials: true });
            Swal.fire("Eliminado", "El proveedor fue eliminado correctamente.", "success");
            cargarProveedores();
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar el proveedor.", "error");
            console.error(error);
        }
    };

    return (
        <>
            <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5" style={{ backgroundColor: "#d9cffa" }} >
                <div className=' d-flex justify-content-center align-items-center m-3 w-75'  >
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o DNI"
                        className=" w-50 mx-3"
                        style={{ width: '700px' }}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <Button variant="light" style={{ backgroundColor: "rgba(63, 3, 175, 0.5)", color: "#fff" }} onClick={() => handleOpenModal("crearProveedor")} >Crear un nuevo Proveedor</Button>

                </div>


                <div className='' style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <Table striped bordered hover responsive className='w-100 table table-striped' style={{ overflowX: 'x' }}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Mail</th>
                                <th>Ver</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {proveedoresFiltrados.length > 0 ? (
                                proveedoresFiltrados.reverse().map((proveedor) => (
                                    <tr key={proveedor.id_proveedor}>
                                        <td>{proveedor.nombre_proveedor}</td>
                                        <td>{proveedor.mail_proveedor}</td>
                                        <td>
                                            <Button className='w-100' size="sm" variant='primary' onClick={() => handleOpenModal("verProveedor", proveedor.id_proveedor)}>Ver</Button>
                                        </td>
                                        <td className="text-center">
                                            <Button className='w-100' size="sm" variant="warning" onClick={() => handleOpenModal("editarProveedor", proveedor.id_proveedor)} >Editar</Button>
                                        </td>

                                        <td className="text-center">
                                            <Button className='w-100' size="sm" variant="danger" onClick={() => { borrar(proveedor.id_proveedor) }} >Eliminar</Button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No se encontraron Proveedores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size='lg' centered>
                <Modal.Header style={{ background: "linear-gradient(90deg, #ffde59, #ff914d)" }}>
                    <Button
                        variant="danger"
                        onClick={handleCloseModal}
                        className="position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32", height: "32", lineHeight: "0", }}
                    >
                       <X size={20} />
                    </Button>
                    <Modal.Title >{TITULOS[fromType]}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center " style={{ background: "linear-gradient(90deg, #ffde59, #ff914d)" }}>
                    {fromType === "crearProveedor" && <CrearProveedor onClose={handleCloseModal} onUpdated={cargarProveedores} />}
                    {fromType === "verProveedor" && <VerProveedor id={proveedorId} />}{/*paso el id por prop */}
                    {fromType === "editarProveedor" && <EditarProveedor id={proveedorId} onClose={handleCloseModal} onUpdated={cargarProveedores} />}

                </Modal.Body>


            </Modal>
        </>
    )
}

export default MainProveedores