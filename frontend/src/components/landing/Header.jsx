import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import logovet from "../../assets/logovet.svg";
import login from "../../assets/login.svg"
import iconoCerrarSesion from "../../assets/iconoCerrarSesion.svg"

function Header() {
  return (
    <Navbar>
      <div className="px-5 w-100 d-flex align-items-center justify-content-between">
        <Navbar.Brand>
          {location.pathname === "/administrator" || location.pathname === "/proveedores" || location.pathname === "/administrator/productos" ? (
            <Link to="/administrator">
          {location.pathname === "/roles" || location.pathname === "/administrator/clientes" || location.pathname === "/administrator/productos" ? (
            <Link to="/">
              <img
                src={logovet}
                width="200px"

                className="d-inline-block align-top"
                alt="Logo Veterinaria"
              />
            </Link>
            ): location.pathname === "/" ? (<img
                src={logovet}
                width="200px"

                className="d-inline-block align-top"
                alt="Logo Veterinaria"
              /> ) : location.pathname === "/login" ? <Link to="/">
              <img
                src={logovet}
                width="200px"

                className="d-inline-block align-top"
                alt="Logo Veterinaria"
              />
            </Link> : "" }


        </Navbar.Brand>
        {location.pathname.startsWith("/administrator") ? (
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/administrator/clientes">CLIENTES</Nav.Link>
            <Nav.Link as={Link} to="/administrator/productos">PRODUCTOS</Nav.Link>
          </Nav>
        ) : location.pathname === "/" ? (
          <Nav className="me-auto">
            <Nav.Link
  href="#gestion"
  style={{
    color: '#a52af1ff',
    textDecoration: 'none',
    transition: 'all 0.5s ease',
    fontWeight: '400',
  }}
  onMouseEnter={(e) => {
    e.target.style.color = '#a52af1ff';
    e.target.style.textDecoration = 'underline';
  }}
  onMouseLeave={(e) => {
    e.target.style.color = '#a52af1ff';
    e.target.style.textDecoration = 'none';
  }}
>
  SoftVet Gestión
</Nav.Link>
          </Nav>
        ) : null}
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {location.pathname === "/"
            ? (<a href="/login"><img
              src={login}
              width="50px"
              alt="Login"
            /> </a>)
            : location.pathname === "/administrator"
              ? (<a href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  const confirmar = window.confirm("¿Estás seguro que querés cerrar sesión?");
                  if (confirmar) {
                    window.location.href = "/login";
                  }
                }}><img
                  src={iconoCerrarSesion}
                  width="50px"
                  alt="CerrarSesion"
                /> </a>)
              : ""
          }

        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;