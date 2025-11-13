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
                    <Button
                        onClick={() => handleOpenModal("crearProveedor")}
                        style={{
                            backgroundColor: "#6f42c1",
                            border: "none",
                            fontWeight: "bold",
                            color: "#fff",
                            boxShadow: "0 4px 0 #6f42c1",
                            transition: "all 0.1s ease",
                            transform: "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #6f42c1";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 0 #6f42c1";
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = "translateY(2px)";
                            e.target.style.boxShadow = "0 2px 0 #6f42c1";
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 0 #6f42c1";
                        }}
                    >
                        Crear un nuevo Proveedor
                    </Button>

                </div>


                <div
                    style={{
                        border: "3px solid #6f42c1",
                        borderRadius: "16px",
                        padding: "25px",
                        backgroundColor: "#f8f9fa",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        width: "85%",
                        maxWidth: "950px",
                        marginTop: "30px",
                    }}>
                    <Table
                        hover
                        responsive
                        style={{
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: "0 12px",
                        }}

                    >
                        <thead>
                            <tr
                                style={{
                                    background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
                                    color: "#fff",
                                    textAlign: "center",
                                    fontSize: "18px",
                                    borderRadius: "10px",
                                }}
                            >
                                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                                    Nombre
                                </th>
                                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>
                                    Mail
                                </th>
                                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {proveedoresFiltrados.length > 0 ? (
                                proveedoresFiltrados.reverse().map((proveedor) => (
                                    <tr key={proveedor.id_proveedor}
                                        style={{
                                            backgroundColor: "#fff",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                            borderRadius: "12px",
                                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                            transform: "translateY(0)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-3px)";
                                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding: "14px 20px",
                                                fontWeight: "500",
                                                textAlign: "center",
                                                color: "#333",
                                                border: "none",
                                            }}
                                        >{proveedor.nombre_proveedor}</td>
                                        <td
                                            style={{
                                                padding: "14px 20px",
                                                fontWeight: "500",
                                                textAlign: "center",
                                                color: "#333",
                                                border: "none",
                                            }}
                                        >{proveedor.mail_proveedor}</td>
                                        <td
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "12px",
                                                border: "none",
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    backgroundColor: "#1ab637",
                                                    border: "none",
                                                    fontWeight: "bold",
                                                    color: "#fff",
                                                    boxShadow: "0 3px 0 #138a28",
                                                    transition: "all 0.1s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 5px 0 #138a28";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "0 3px 0 #138a28";
                                                }}
                                                onClick={() => handleOpenModal("verProveedor", proveedor.id_proveedor)}>Ver</Button>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                style={{
                                                    backgroundColor: "#ffc107",
                                                    border: "none",
                                                    fontWeight: "bold",
                                                    color: "#333",
                                                    boxShadow: "0 3px 0 #d39e00",
                                                    transition: "all 0.1s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 5px 0 #d39e00";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "0 3px 0 #d39e00";
                                                }}
                                                onClick={() => handleOpenModal("editarProveedor", proveedor.id_proveedor)} >Editar</Button>
                                        </td>

                                        <td className="text-center">
                                            <Button
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    border: "none",
                                                    fontWeight: "bold",
                                                    color: "#fff",
                                                    boxShadow: "0 3px 0 #a71d2a",
                                                    transition: "all 0.1s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 5px 0 #a71d2a";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "0 3px 0 #a71d2a";
                                                }}
                                                onClick={() => { borrar(proveedor.id_proveedor) }} >Eliminar</Button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                                        No se encontraron Proveedores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal show={showModal}
                onHide={handleCloseModal}
                centered
                backdrop="static"
                size="lg">

                <div
                    style={{
                        background: 'linear-gradient(135deg, #FFD700, #32CD32)',
                        padding: '25px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                    }}
                >
                    {/* Botón de cerrar (cruz roja más chica y cuadrada) */}
                    <button
                        onClick={handleCloseModal}
                        aria-label="Cerrar"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
                    >
                        ✕
                    </button>

                    {/* Caja interior del modal */}
                    <div
                        style={{
                            backgroundColor: '#cfcfcf',
                            padding: '30px 60px',
                            textAlign: 'center',
                            width: '700px',
                            margin: 'auto',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                        }}
                    >
                        <h4
                            style={{
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                marginBottom: '25px',
                            }}
                        >
                            {TITULOS[fromType]}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {fromType === "crearProveedor" && <CrearProveedor onClose={handleCloseModal} onUpdated={cargarProveedores} />}
                            {fromType === "verProveedor" && <VerProveedor id={proveedorId} />}{/*paso el id por prop */}
                            {fromType === "editarProveedor" && <EditarProveedor id={proveedorId} onClose={handleCloseModal} onUpdated={cargarProveedores} />}
                        </div>
                    </div>
                </div>
                

            </Modal>
        </>
    )
}

export default MainProveedores