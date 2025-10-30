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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '4rem 6rem',
    flexWrap: 'wrap',
    gap: '2rem'
  }}
>
  
  <div style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
    <h1
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2rem',
        textAlign: 'left'
      }}
    >
      NO ESPERES MÁS, CONTACTANOS!
    </h1>

    <Form style={{ color: '#fff' }}>
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Control type="email" placeholder="Correo Electrónico" required style={{ width: '800px' }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Control type="text" placeholder="Nombre Completo" required style={{ width: '800px' }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formVeterinaria">
        <Form.Control type="text" placeholder="Nombre de la Veterinaria" required style={{ width: '800px' }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTelefono">
        <Form.Control type="tel" placeholder="Número de Teléfono de Contacto" required style={{ width: '800px' }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formMensaje">
        <Form.Control as="textarea" placeholder="Mensaje" rows={4} style={{ width: '800px' }}/>
      </Form.Group>

      <Button 
      size="lg"
  style={{
    backgroundColor: '#f9b700',
    borderColor: '#f9b700',
    color: '#020202ff',
    fontWeight: '600',
    transition: 'transform 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
>
  Enviar Formulario
      </Button>
    </Form>
  </div>

  
  <div
    style={{
      flex: 1,
      minWidth: '300px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <img
      src={form}
      alt="Formulario"
      style={{ maxWidth: '125%', height: 'auto', objectFit: 'contain', marginLeft: '250px' }}
    />
  </div>
</div>

  );
}

export default formulario;