import React, { use, useEffect } from "react";
import { Container, Row, Col, Card, Form, Badge, } from "react-bootstrap";
import { People, Calendar2Check, Clock, CalendarX, EyeSlash, Capsule, PersonFill, Scissors, Globe, Hospital, } from "react-bootstrap-icons";
import { useEmpleadoStore } from "../../zustand/empleado";
import { useClientesStore } from "../../zustand/cliente";
import { clientes } from "../../endpoints/endpoints";
import axios from "axios";
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
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <People size={40} />
                  <h2>{cliente?.length || 0}</h2>
                  <p>Clientes Activos</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Calendar2Check size={40} />
                  <h2>0</h2>
                  <p>Gestionar Agenda</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Clock size={40} />
                  <h2>0</h2>
                  <p>Cola de Espera</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <CalendarX size={40} />
                  <h2>
                    9 <Badge bg="danger">!</Badge>
                  </h2>
                  <p>Turnos Vencidos</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <EyeSlash size={40} />
                  <h2>--</h2>
                  <p>Balance de Caja</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Selector de tipo de evento */}
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={4}>
              <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "#a5d2fa" }}>
                <Form.Select>
                  <option>Tipo de evento</option>
                  <option>Todos</option>
                  <option>Hoy</option>
                  <option>Semana</option>
                  <option>Mes</option>
                </Form.Select>
                <div className="d-flex justify-content-around mt-2">
                  <span>Hoy <Badge bg="danger">10</Badge></span>
                  <span>Semana <Badge bg="danger">20</Badge></span>
                  <span>Mes <Badge bg="danger">90</Badge></span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Segunda fila */}
          <Row className="justify-content-center">
            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Capsule size={40} />
                  <h2>5</h2>
                  <p>Vacunación</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <PersonFill size={40} />
                  <h2>10</h2>
                  <p>Atención Clínica</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Scissors size={40} />
                  <h2>5</h2>
                  <p>Baño y Peluquería</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Globe size={40} />
                  <h2>8</h2>
                  <p>Desparasitación</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                <Card.Body>
                  <Hospital size={40} />
                  <h2>1</h2>
                  <p>Quirófano</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
