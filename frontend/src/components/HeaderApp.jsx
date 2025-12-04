import React, { useState } from 'react';
import { Navbar, Container, Offcanvas, Nav, Row, Col, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logovet from '../assets/logovet.svg';
import { useEmpleadoStore } from '../zustand/empleado';
import { FaUser, FaHome, FaMapMarkerAlt, FaBox, FaUserShield, FaUsers, FaPaw } from 'react-icons/fa';
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

    const cerrarSesion = async () => {
        try {
            const { data } = await axios(`${empleados}/logout`, { withCredentials: true })
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
                                    {empleado?.nombre_empleado || "Usuario Invitado"}
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
                        <Nav.Link as={Link} to="/empleados"> <FaUsers className="me-2" /> Empleados</Nav.Link>
                        <Nav.Link as={Link} to="/clientes"> <FaUsers className="me-2" /> Clientes</Nav.Link>
                        {/* <Nav.Link as={Link} to="/mascotas"> <FaUsers className="me-2" /> Mascotas</Nav.Link> */}
                        {/* <Nav.Link as={Link} to="/historiaClinica"> <FaUsers className="me-2" /> Historias Clinicas</Nav.Link> */}
                        <Nav.Link as={Link} to="/ventas"> <FaUsers className="me-2" />Ventas</Nav.Link>
                        <Nav.Link as={Link} to="/productos"> <FaUsers className="me-2" />Productos</Nav.Link>
                        <Nav.Link as={Link} to="/proveedores"> <FaBox className="me-2" /> Proveedores</Nav.Link>
                        {/* <Nav.Link as={Link} to="/especies"> <FaPaw className="me-2" /> Especies</Nav.Link>
                        <Nav.Link as={Link} to="/razas"> <MdPets className="me-2" /> Razas</Nav.Link> */}
                        <Nav.Link as={Link} to="/roles"> <FaUserShield className="me-2" /> Roles</Nav.Link>
                        <Nav.Link as={Link} to="/categorias"> <FaUserShield className="me-2" /> Categorias</Nav.Link>
                        <Nav.Link as={Link} to="/sucursales"> <FaUserShield className="me-2" /> Sucursales</Nav.Link>
                        <div
                            style={{
                                width: "100%",
                                height: "2px",
                                background: "linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)",
                                margin: "10px 0",
                            }}
                        ></div>
                        <NavDropdown
                            id="nav-acerca-dropdown"
                            title={
                                <>
                                    <FaUserShield className="me-2" />
                                    Acerca de
                                </>
                            }
                            menuVariant="dark"
                        >
                            <NavDropdown.Item
                                as="a"
                                href="https://drive.google.com/uc?export=download&id=1a63jlZZWQyNIJ9W3h0FZXBf_BSVu4-pn"
                                download
                            >
                                Manual de Usuario
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/quienes-somos">
                                Quiénes somos
                            </NavDropdown.Item>

                            <NavDropdown.Item as={Link} to="https://wa.me/5493812193799" target="_blank" rel="noopener noreferrer">
                                Soporte
                            </NavDropdown.Item>

                        </NavDropdown>

                    </Nav>
                </Offcanvas.Body>
                <div className="px-3 pb-3">
                    <button
                        onClick={cerrarSesion}
                        className="btn-logout w-100"
                        style={{
                            background: "linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)",
                            border: "none",
                            color: "white",
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 12px 20px rgba(138, 69, 255, 0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                        }}
                    >
                        <span>Cerrar Sesión</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </Offcanvas>
        </>
    );
};

export default Header;
