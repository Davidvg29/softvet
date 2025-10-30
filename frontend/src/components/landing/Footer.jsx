import logovet from "../../assets/logovet.svg";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "rgba(176, 164, 197, 0.5)", color: "#1d0b0bff" }} className="py-3">
      <div className="text-center">
        <img src={logovet} alt="VetSoft Logo" style={{ height: "40px" }} />
        <p className="mb-0">© 2025 SoftVet. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
