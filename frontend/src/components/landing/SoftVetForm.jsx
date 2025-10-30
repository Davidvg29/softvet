import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import form from '../../assets/form.svg';

function formulario() {
  return (
    <div
  style={{
    backgroundColor: '#6f42c1',
    color: '#fff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: '4rem 3rem',
    flexWrap: 'wrap',
    gap: '2rem',
    overflowX: 'hidden',
  }}
>
  {/* COLUMNA IZQUIERDA - FORMULARIO */}
  <div
    style={{
      flex: '1 1 500px',
      maxWidth: '600px',
      width: '100%',
    }}
  >
    <h1
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '2.2rem',
        fontWeight: '700',
        marginBottom: '2rem',
        textAlign: 'left',
      }}
    >
      NO ESPERES MÁS, CONTACTANOS!
    </h1>

    <Form style={{ color: '#fff' }}>
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Control type="email" placeholder="Correo Electrónico" required />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Control type="text" placeholder="Nombre Completo" required />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formVeterinaria">
        <Form.Control type="text" placeholder="Nombre de la Veterinaria" required />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTelefono">
        <Form.Control type="tel" placeholder="Número de Teléfono de Contacto" required />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formMensaje">
        <Form.Control as="textarea" placeholder="Mensaje" rows={4} />
      </Form.Group>

      <Button
        size="lg"
        style={{
          backgroundColor: '#f9b700',
          borderColor: '#f9b700',
          color: '#020202ff',
          fontWeight: '600',
          transition: 'transform 0.3s ease',
          width: '100%',
          maxWidth: '300px',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Enviar Formulario
      </Button>
    </Form>
  </div>

  {/* COLUMNA DERECHA - IMAGEN */}
  <div
    style={{
      flex: '1 1 600px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '550px',
      overflow: 'hidden', // evita que se salga al hacer zoom
    }}
  >
    <img
      src={form}
      alt="Formulario"
      className="contact-image"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'transform 0.8s ease', // 🔹 transición suave
      }}
    />
  </div>

  {/* ESTILOS RESPONSIVOS */}
  <style>
    {`
      .contact-image:hover {
        transform: scale(1.1); /* 🔹 zoom suave */
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

export default formulario;