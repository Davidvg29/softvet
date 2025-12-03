import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import formImg from "../../assets/form.svg";

function Formulario() {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    veterinaria: "",
    telefono: "",
    mensaje: "",
  });

  // manejar cambios
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, nombre, veterinaria, telefono, mensaje } = formData;

    // VALIDACIÓN simple
    if (!email || !nombre || !veterinaria || !telefono) {
      alert("Por favor completá todos los campos obligatorios.");
      return;
    }

    // Armamos el texto del WhatsApp
    const texto = `
*Nuevo formulario enviado:*

📧 *Email:* ${email}
👤 *Nombre:* ${nombre}
🏥 *Veterinaria:* ${veterinaria}
📱 *Teléfono:* ${telefono}
📝 *Mensaje:* ${mensaje || "(Sin mensaje)"} 
    `;

    const numero = "543813965671"; // 👈 CAMBIÁ ESTO POR TU NÚMERO
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    // Redirige a WhatsApp
    window.location.href = url;
  };

  return (
    <div
      style={{
        backgroundColor: "#6f42c1",
        color: "#fff",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        padding: "4rem 3rem",
        flexWrap: "wrap",
        gap: "2rem",
        overflowX: "hidden",
      }}
    >
      {/* COLUMNA IZQUIERDA */}
      <div
        style={{
          flex: "1 1 500px",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontFamily: "Segoe UI, sans-serif",
            fontSize: "2.2rem",
            fontWeight: "700",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          NO ESPERES MÁS, CONTACTANOS!
        </h1>

        <Form style={{ color: "#fff" }} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="veterinaria"
              placeholder="Nombre de la Veterinaria"
              value={formData.veterinaria}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="tel"
              name="telefono"
              placeholder="Número de Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="mensaje"
              placeholder="Mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            size="lg"
            type="submit"
            style={{
              backgroundColor: "#f9b700",
              borderColor: "#f9b700",
              color: "#020202ff",
              fontWeight: "600",
              transition: "transform 0.3s ease",
              width: "100%",
              maxWidth: "300px",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Enviar Formulario
          </Button>
        </Form>
      </div>

      {/* COLUMNA DERECHA */}
      <div
        style={{
          flex: "1 1 600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "550px",
          overflow: "hidden",
        }}
      >
        <img
          src={formImg}
          alt="Formulario"
          className="contact-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.8s ease",
          }}
        />
      </div>

      <style>
        {`
          .contact-image:hover {
            transform: scale(1.1);
          }

          @media (max-width: 992px) {
            div[style*="background-color: #6f42c1"] {
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 3rem 2rem;
            }

            .contact-image {
              width: 100%;
              height: auto;
              max-width: 500px;
              object-fit: contain;
              margin-top: 2rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Formulario;
