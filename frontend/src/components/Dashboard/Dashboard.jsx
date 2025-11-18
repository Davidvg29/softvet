import React, { use, useEffect } from "react";
import { Container, Row, Col, Card, Form, Badge, } from "react-bootstrap";
import { People, Calendar2Check, Clock, CalendarX, EyeSlash, Capsule, PersonFill, Scissors, Globe, Hospital, } from "react-bootstrap-icons";
import { useEmpleadoStore } from "../../zustand/empleado";
import { useClientesStore } from "../../zustand/cliente";
import { clientes } from "../../endpoints/endpoints";
import axios from "axios";
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const { cliente, setCliente } = useClientesStore();



  useEffect(() => {

    const response = async () => {
      try {
        const res = await axios.get(`${clientes}/ver`, { withCredentials: true });
        console.log("Datos obtenidos del backend:", res.data);
        setCliente(res.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    response();
  }, [setCliente]);

  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="g-0">
        {/* ===== Sidebar Izquierda ===== */}
        <Col
          xs="auto"
          className="d-flex flex-column align-items-center p-3 text-white sidebar-col"
          style={{
            width: "260px",
            maxWidth: "100%", // nunca supera el 100% de la pantalla
            backgroundColor: "#d7c9f7",
            borderTopRightRadius: "1px",
            borderBottomRightRadius: "1px",
            minHeight: "100vh",
          }}
        >
          {/* Tarjeta de Veterinaria y Usuario */}
          <div
            className="text-center p-3 shadow"
            style={{
              backgroundColor: "#a0d8ff",
              borderRadius: "20px",
              width: "100%",
            }}
          >
            {/* Logo principal */}
            <div
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#a86cf0",
                border: "3px solid white",
                position: "relative",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="Logo veterinaria"
                width="60"
                height="60"
              />
              {/* Icono usuario pequeño */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                alt="Usuario"
                width="40"
                height="40"
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "-10px",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  backgroundColor: "#fff",
                }}
              />
            </div>

            {/* Nombre de la veterinaria */}
            <h5 className="fw-bold text-white">Veterinaria</h5>
            <h5 className="fw-bold text-white">MichiCan</h5>

            {/* Nombre del usuario */}
            <p className="text-white mt-2">{empleado?.usuario || "Usuario Invitado"}</p>
          </div>
        </Col>

        {/* ===== Contenido Principal ===== */}
        <Col
          className="p-4"
          style={{
            backgroundColor: "#e4d6fa",
            minHeight: "100vh",
          }}
        >
          {/* Primera fila */}
          <Row className="justify-content-center mb-4">
            <Col xs={6} md={2} className="mb-3">
              <Link to="/empleados">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 4}</h2> */}
                    <p>Empleados</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/clientes">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 3}</h2> */}
                    <p>Clientes</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/proveedores">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 3}</h2> */}
                    <p>Proveedores</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/especies">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Especies</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Ventas</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Compras</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Stock</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Productos</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Historia clinica</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/razas">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Razas</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Productos</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/roles">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Roles</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Turnos</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Categorias</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Sucursales</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Link to="/mascotas">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Mascotas</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
