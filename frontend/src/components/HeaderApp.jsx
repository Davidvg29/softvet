import React, { useState } from 'react';
import { Navbar, Container, Offcanvas, Nav, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logovet from '../assets/logovet.svg';
import { useEmpleadoStore } from '../zustand/empleado';
import { FaUser, FaHome, FaMapMarkerAlt, FaBox, FaUserShield, FaUsers, FaPaw} from 'react-icons/fa';
import { MdPets } from "react-icons/md";
import axios from 'axios';
import { empleados } from '../endpoints/endpoints';
const Header = () => {
    const empleado = useEmpleadoStore((state) => state.empleado);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { logout } = useEmpleadoStore();
    const navigate = useNavigate()

    const cerrarSesion = async()=>{
        try {
            const {data} = await axios(`${empleados}/logout`, { withCredentials: true })
            console.log(data);
            logout()
            navigate("/login")
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <>
            <Navbar variant="dark" expand={false} className="bg-purple-custom shadow-sm">
                <Container fluid>
                    <Row className="w-100 align-items-center">

                        {/* Col izquierda: hamburguesa */}
                        <Col xs="auto">
                            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
                        </Col>

                        {/* Col medio: nombre veterinaria y sede */}
                        <Col xs="auto" className="d-flex flex-column ms-2">
                            <div className="d-flex align-items-center text-white">
                                <FaHome className="me-1" />
                                <span className="fw-bold">Veterinaria MichiCan</span>
                            </div>
                            <div className="d-flex align-items-center text-white mt-1">
                                <FaMapMarkerAlt className="me-1" />
                                <small>Casa Central</small>
                            </div>
                        </Col>

                        {/* Col central: logo */}
                        <Col className="text-center">
                            <Link to="/dashboard">
                                <Navbar.Brand as="div" className="m-0">
                                    <img src={logovet} height="30" alt="Soft Vet" />
                                </Navbar.Brand>
                            </Link>
                        </Col>

                        {/* Col derecha: usuario */}
                        <Col xs="auto" className="text-end">
                            <Nav className="d-flex align-items-center text-white">
                                <span className="d-flex align-items-center">
                                    {empleado?.usuario || "Usuario Invitado"}
                                    <FaUser className="ms-2" size={20} />
                                </span>
                            </Nav>
                        </Col>

                    </Row>
                </Container>
            </Navbar>

            {/* Sidebar / Offcanvas */}
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="start"
                style={{
                    width: "260px",
                    backgroundColor: "#d7c9f7",
                    borderTopRightRadius: "1px",
                    borderBottomRightRadius: "1px",
                    minHeight: "100vh",
                }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <Link to="/dashboard" className="d-flex align-items-center text-decoration-none text-dark">
                            <FaHome className="me-2" />
                            Menú
                        </Link>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/proveedores"> <FaBox className="me-2" /> Proveedores</Nav.Link>
                        <Nav.Link as={Link} to="/roles"> <FaUserShield className="me-2" /> Roles</Nav.Link>
                        <Nav.Link as={Link} to="/empleados"> <FaUsers className="me-2" /> Empleados</Nav.Link>
                        <Nav.Link as={Link} to="/especies"> <FaPaw className="me-2" /> Especies</Nav.Link>
                        <Nav.Link as={Link} to="/razas"> <MdPets  className="me-2" /> Razas</Nav.Link>

                    </Nav>
                </Offcanvas.Body>
                <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </Offcanvas>
        </>
    );
};

export default Header;
