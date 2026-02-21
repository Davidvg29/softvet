import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Users, UserCog, Truck, Dna, CreditCard, ShoppingCart, Layers, Package, FileText, PawPrint, ShieldCheck, CalendarClock, Tags, Building2, Dog, LineChart
} from "lucide-react";

import { useEmpleadoStore } from "../../zustand/empleado";
import { useClientesStore } from "../../zustand/cliente";
import { useProductosStore } from "../../zustand/productos";
import { useMascotasStore } from "../../zustand/mascota";
import { useEmpleadosStore } from "../../zustand/empleados";
import { useHCStore } from "../../zustand/historiasClinicas";
import { useTurnosStore } from "../../zustand/turnos";
import axios from "axios";
import { Link } from "react-router-dom";

import { clientes as CLIENTES_URL, productos as PRODUCTOS_URL, mascotas as MASCOTAS_URL, empleados as EMPLEADOS_URL, historiasClinicas as HISTORIASCLINICAS_URL, TURNOS } from "../../endpoints/endpoints";

const Dashboard = () => {
  const empleado = useEmpleadoStore((state) => state.empleado);
  const rol = empleado?.nombre_rol;
  const { empleados, setEmpleados } = useEmpleadosStore();
  const { clientes, setClientes } = useClientesStore();
  const { productos, setProductos } = useProductosStore();
  const { mascotas, setMascotas } = useMascotasStore();
  const { hc: historiasClinicas, setHistoriasClinicas: setHistoriasClinicas } = useHCStore();
  const { turnos, setTurnos } = useTurnosStore();
  const [turnosPendientes, setTurnosPendientes] = useState([])

  useEffect(() => {

    const getEmpleados = async () => {
      try {
        const { data } = await axios.get(`${EMPLEADOS_URL}/ver`, { withCredentials: true });
        setEmpleados(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    const getClientes = async () => {
      try {
        const { data } = await axios.get(`${CLIENTES_URL}/ver`, { withCredentials: true });
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    const getProductos = async () => {
      try {
        const { data } = await axios.get(`${PRODUCTOS_URL}/ver`, { withCredentials: true });
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    const getMascotas = async () => {
      try {
        const { data } = await axios.get(`${MASCOTAS_URL}/ver`, { withCredentials: true });
        setMascotas(data);
      } catch (error) {
        console.error("Error al obtener las mascotas:", error);
      }
    };
    const getHC = async () => {
      try {
        const { data } = await axios.get(`${HISTORIASCLINICAS_URL}/ver`, { withCredentials: true });
        setHistoriasClinicas(data);
      } catch (error) {
        console.error("Error al obtener las Historias Clinicas:", error);
      }
    };
    const getTurnos = async()=>{
      try {
        const { data } = await axios.get(`${TURNOS}/ver`, { withCredentials: true });
        setTurnos(data)
        const turnosFiltrados = data.filter((t) => t.estado === "Pendiente");
        setTurnosPendientes(turnosFiltrados);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
      }
    }
    getEmpleados();
    getClientes();
    getProductos();
    getMascotas();
    getHC();
    getTurnos()
  }, [setEmpleados, setClientes, setProductos, setMascotas, setHistoriasClinicas, setTurnos]);

  // ESTILO BASE DE LAS CARDS
  const baseCardStyle = {
    background: "linear-gradient(135deg, #8f52ea 0%, #a56bf4 100%)",
    color: "white",
    borderRadius: "22px",
    padding: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    userSelect: "none"
  };

  const iconStyle = {
    transition: "transform 0.35s ease"
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  //  CARD REUSABLE 
  const DashboardCard = ({ to, label, Icon, index, count }) => {
    const isHovered = hoveredIndex === index;

    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <Card
          className="text-center shadow position-relative"
          style={{
            ...baseCardStyle,
            transition: "transform 0.35s ease, box-shadow 0.35s ease",
            transform: isHovered
              ? "translateY(-10px) scale(1.06)"
              : "translateY(0) scale(1)",
            boxShadow: isHovered
              ? "0 18px 28px rgba(0,0,0,0.25)"
              : "0 4px 12px rgba(0,0,0,0.15)",
            border: isHovered
              ? "1px solid rgba(255,255,255,0.45)"
              : "1px solid transparent",
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >

          {/* BADGE */}
          {count !== undefined && (
            <div
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#ff4d6d",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: "bold",
                boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
                border: "2px solid white",
                transition: "0.3s ease",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
              }}
            >
              {count}
            </div>
          )}

          <Card.Body>
            <Icon
              size={42}
              style={{
                transition: "transform 0.35s ease",
                transform: isHovered ? "scale(1.18)" : "scale(1)",
              }}
            />

            <p
              style={{
                marginTop: "10px",
                fontSize: "1.1rem",
                fontWeight: "600",
                transition: "0.3s ease",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
              }}
            >
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

        {/* ==== SIDEBAR ==== */}
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
              backgroundColor: "#5fb0eaff",
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
              {empleado?.nombre_empleado || "Usuario Invitado"}
            </p>
            <p className="text-white mt-2">
              {empleado?.nombre_rol || "Usuario Invitado"}
            </p>
          </div>
        </Col>

        {/* ==== CONTENIDO PRINCIPAL ==== */}
        <Col className="p-4" style={{ backgroundColor: "#e4d6fa" }}>
          <Row className="g-3 mb-4 d-flex flex-wrap justify-content-center">

            {(rol === "Administrador") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/empleados" label="Empleados" Icon={UserCog} index={0} count={empleados?.length} />
              </Col>
            )}

            {(rol === "Administrador" || rol === "Recepcionista") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/clientes" label="Clientes" Icon={Users} index={1} count={clientes?.length} />
              </Col>
            )}

            {(rol === "Administrador" || rol === "Veterinario" || rol === "Recepcionista") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/mascotas" label="Mascotas" Icon={Dog} index={15} count={mascotas?.length} />
              </Col>
            )}

            {(rol === "Administrador" || rol === "Veterinario" || rol === "Recepcionista") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/historiaClinica" label="Historia Clínica" Icon={FileText} index={8} count={historiasClinicas?.length} />
              </Col>
            )}

            {(rol === "Administrador" || rol === "Recepcionista") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/ventas" label="Ventas" Icon={CreditCard} index={4} />
              </Col>
            )}

            {/* <Col xs="auto" className="mb-3"  style={{ width: "200px", height: "180px" }}>
              <DashboardCard to="/compras" label="Compras" Icon={ShoppingCart} index={5} />
            </Col> */}

            {(rol === "Administrador") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/productos" label="Productos" Icon={Package} index={7} count={productos?.length} />
              </Col>
            )}

            {(rol === "Administrador") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/stock" label="Stock" Icon={Layers} index={6} />
              </Col>
            )}

            {/* <Col xs="auto" className="mb-3"  style={{ width: "200px", height: "180px" }}>
              <DashboardCard to="/proveedores" label="Proveedores" Icon={Truck} index={2} />
            </Col> */}

            {(rol === "Administrador" || rol === "Veterinario") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/especies" label="Especies" Icon={Dna} index={3} />
              </Col>
            )}

            {(rol === "Administrador" || rol === "Veterinario") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/razas" label="Razas" Icon={PawPrint} index={9} />
              </Col>
            )}
            {/* <Col xs="auto" className="mb-3"  style={{ width: "200px", height: "180px" }}>
              <DashboardCard to="/roles" label="Roles" Icon={ShieldCheck} index={11} />
            </Col> */}
            {(rol === "Administrador" || rol === "Recepcionista") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/turnos" label="Turnos" Icon={CalendarClock} index={12}  count={turnosPendientes.length}/>
              </Col>
            )}

            {(rol === "Administrador") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/categorias" label="Categorias" Icon={Tags} index={13} />
              </Col>
            )}

            {/* <Col xs="auto" className="mb-3"  style={{ width: "200px", height: "180px" }}>
              <DashboardCard to="/sucursales" label="Sucursales" Icon={Building2} index={14} />
            </Col> */}

            {(rol === "Administrador") && (
              <Col xs="auto" className="mb-3" style={{ width: "200px", height: "180px" }}>
                <DashboardCard to="/informe" label="Informes" Icon={LineChart} index={16} />
              </Col>
            )}

          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
