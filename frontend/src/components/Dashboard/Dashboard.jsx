import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Users,
  UserCog,
  Truck,
  Dna,
  CreditCard,
  ShoppingCart,
  Layers,
  Package,
  FileText,
  PawPrint,
  ShieldCheck,
  CalendarClock,
  Tags,
  Building2,
  Dog
} from "lucide-react";

import { useEmpleadoStore } from "../../zustand/empleado";
import { useClientesStore } from "../../zustand/cliente";
import axios from "axios";
<<<<<<< HEAD
import { Link } from "react-router-dom";

const Dashboard = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const { cliente, setCliente } = useClientesStore();

  useEffect(() => {
    const response = async () => {
      try {
        const res = await axios.get(`${clientes}/ver`, { withCredentials: true });
        setCliente(res.data);
=======
import { Link } from 'react-router-dom';
import { CLIENTES, PRODUCTOS } from "../../endpoints/endpoints";
import { useProductosStore } from "../../zustand/productos";
const Dashboard = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const { clientes, setClientes } = useClientesStore();
  const {productos, setProductos} = useProductosStore()

  useEffect(() => {
    const getClientes = async () => {
      try {
        const {data} = await axios.get(`${CLIENTES}/ver`, { withCredentials: true });
        setClientes(data);
>>>>>>> 0987aaec8ca021000336a6572583798a9aa6abb5
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    const getProductos = async () => {
      try {
        const {data} = await axios.get(`${PRODUCTOS}/ver`, { withCredentials: true });
        console.log(data);
        
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    getClientes();
    getProductos();
  }, [setClientes, setProductos]);

  // =============================
  // 🎨 ESTILOS DE LAS CARDS
  // =============================
  const baseCardStyle = {
    background: "linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)",
    color: "white",
    borderRadius: "22px",
    padding: "10px",
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border 0.25s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  };

  const iconStyle = {
    transition: "transform 0.3s ease"
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // =============================
  // 🎯 COMPONENTE CARD REUSABLE
  // =============================
  const DashboardCard = ({ to, label, Icon, index }) => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      setTilt({
        rotateX: (y / 20) * -1,
        rotateY: x / 20
      });
    };

    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <Card
          className="text-center shadow"
          style={{
            ...baseCardStyle,
            transform:
              hoveredIndex === index
                ? `translateY(-8px) scale(1.06) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                : "scale(1)",
            boxShadow:
              hoveredIndex === index
                ? "0 18px 32px rgba(0,0,0,0.35)"
                : "0 4px 12px rgba(0,0,0,0.15)",
            border:
              hoveredIndex === index
                ? "1px solid rgba(255,255,255,0.35)"
                : "1px solid transparent"
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          <Card.Body>
            <Icon
              size={40}
              style={{
                ...iconStyle,
                transform:
                  hoveredIndex === index ? "scale(1.22) rotate(5deg)" : "scale(1)"
              }}
            />
            <p style={{ marginTop: "8px", fontSize: "1.1rem", fontWeight: "600" }}>
              {label}
            </p>
          </Card.Body>
        </Card>
      </Link>
    );
  };

  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="g-0">
        {/* ==== Sidebar ==== */}
        <Col
          xs="auto"
          className="d-flex flex-column align-items-center p-3 text-white sidebar-col"
          style={{
            width: "260px",
            backgroundColor: "#d7c9f7",
            minHeight: "100vh"
          }}
        >
          <div
            className="text-center p-3 shadow"
            style={{
              backgroundColor: "#a0d8ff",
              borderRadius: "20px",
              width: "100%"
            }}
          >
            <div
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#a86cf0",
                border: "3px solid white"
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="Logo veterinaria"
                width="60"
                height="60"
              />
            </div>

            <h5 className="fw-bold text-white">Veterinaria</h5>
            <h5 className="fw-bold text-white">MichiCan</h5>

            <p className="text-white mt-2">
              {empleado?.usuario || "Usuario Invitado"}
            </p>
          </div>
        </Col>

        {/* ============= CONTENIDO PRINCIPAL ============= */}
        <Col className="p-4" style={{ backgroundColor: "#e4d6fa" }}>
          <Row className="justify-content-center mb-4">

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/empleados" label="Empleados" Icon={UserCog} index={0} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/clientes" label="Clientes" Icon={Users} index={1} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/proveedores" label="Proveedores" Icon={Truck} index={2} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/especies" label="Especies" Icon={Dna} index={3} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
<<<<<<< HEAD
              <DashboardCard to="" label="Ventas" Icon={CreditCard} index={4} />
=======
              <Link to="/ventas">
                <Card className="text-center shadow" style={{ backgroundColor: "#8f52ea", color: "white", borderRadius: "20px" }}>
                  <Card.Body>
                    <People size={40} />
                    {/* <h2>{cliente?.length || 2}</h2> */}
                    <p>Ventas</p>
                  </Card.Body>
                </Card>
              </Link>
>>>>>>> 0987aaec8ca021000336a6572583798a9aa6abb5
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Compras" Icon={ShoppingCart} index={5} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Stock" Icon={Layers} index={6} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Productos" Icon={Package} index={7} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Historia Clínica" Icon={FileText} index={8} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/razas" label="Razas" Icon={PawPrint} index={9} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/productos" label="Productos" Icon={Package} index={10} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/roles" label="Roles" Icon={ShieldCheck} index={11} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Turnos" Icon={CalendarClock} index={12} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Categorias" Icon={Tags} index={13} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="" label="Sucursales" Icon={Building2} index={14} />
            </Col>

            <Col xs={6} md={2} className="mb-3">
              <DashboardCard to="/mascotas" label="Mascotas" Icon={Dog} index={15} />
            </Col>

          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;