import { Link, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logovet from "../../assets/logovet.svg";
import login from "../../assets/login.svg";
import iconoCerrarSesion from "../../assets/iconoCerrarSesion.svg";

function Header() {
  const location = useLocation();
  const path = location.pathname;

  const isAdminPath = path.startsWith("/administrator");
  const showLogoAsLink =
    path === "/roles" ||
    path === "/administrator/clientes" ||
    path === "/administrator/productos" ||
    path === "/empleados" ||
    path === "/proveedores";

  return (
    <Navbar>
      <div className="px-5 w-100 d-flex align-items-center justify-content-between">
        <Navbar.Brand>
          {showLogoAsLink || path === "/login" ? (
            <Link to="/">
              <img
                src={logovet}
                width="200px"
                className="d-inline-block align-top"
                alt="Logo Veterinaria"
              />
            </Link>
          ) : (
            <img
              src={logovet}
              width="200px"
              className="d-inline-block align-top"
              alt="Logo Veterinaria"
            />
          )}
        </Navbar.Brand>

        {/* Navegación dependiendo del path */}
        {isAdminPath ? (
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/administrator/clientes">
              CLIENTES
            </Nav.Link>
            <Nav.Link as={Link} to="/administrator/productos">
              PRODUCTOS
            </Nav.Link>
          </Nav>
        ) : path === "/" ? (
          <Nav className="me-auto">
            <Nav.Link
              href="#gestion"
              style={{
                color: "#a52af1ff",
                textDecoration: "none",
                transition: "all 0.5s ease",
                fontWeight: "400",
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              SoftVet Gestión
            </Nav.Link>
          </Nav>
        ) : null}

        {/* Íconos derecha */}
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {path === "/" ? (
            <Link to="/login">
              <img src={login} width="50px" alt="Login" />
            </Link>
          ) : isAdminPath ? (
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                const confirmar = window.confirm(
                  "¿Estás seguro que querés cerrar sesión?"
                );
                if (confirmar) window.location.href = "/login";
              }}
            >
              <img
                src={iconoCerrarSesion}
                width="50px"
                alt="Cerrar Sesión"
                style={{ cursor: "pointer" }}
              />
            </a>
          ) : null}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
