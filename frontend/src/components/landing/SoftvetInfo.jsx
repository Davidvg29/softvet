import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import nube from '../../assets/nube.svg';
import compu from '../../assets/compu.svg';
import escudo from '../../assets/escudo.svg';
import soporte from '../../assets/soporte.svg';

const Info = () => {

    return (
        <>

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-4 p-4 " style={{ minHeight: '100vh' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '2.8rem',
                        fontWeight: '700',
                        color: '#020202ff',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        ¿Sentís que la{' '}
                            <span style={{ color: '#f9b700' }}>gestión de tu veterinaria</span>{' '} te consume demasiado tiempo?
                    </h1>
                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#020202ff',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        Tranquilo, con SoftVet vas a poder enfocarte en lo que realmente importa: tus pacientes.
                    </h1>

                </div>
                <div>
                    <Card style={{
      width: '18rem',
      textAlign: 'center',
      border: '2px solid #444',
      transition: 'all 0.3s ease',
    }}
    className="shadow-sm"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}>
                         <Card.Img variant="top" src= {nube} alt="Sistema en la Nube" />
                        <Card.Body>
                            <Card.Title>Sistema en la Nube</Card.Title>
                            <Card.Text className="text-muted">
                                SoftVet permite gestionar tu clínica veterinaria 100% en línea desde cualquier dispositivo (Smartphones, Tablets, PCs), en cualquier momento y lugar, con acceso total a la información de la veterinaria.
                            </Card.Text>
                         
                        </Card.Body>
                    </Card>
                </div>

                <div>
                    <Card style={{
      width: '18rem',
      textAlign: 'center',
      border: '2px solid #444',
      transition: 'all 0.3s ease',
    }}
    className="shadow-sm"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}>
                        <Card.Img variant="top" src= {compu} alt="Simple y Tecnologica" />
                        <Card.Body>
                            <Card.Title>Simple y Tecnológica</Card.Title>
                            <Card.Text className="text-muted">
                                SoftVet integra tecnología avanzada para tu clínica veterinaria.
                                Gestiona turnos y recordatorios automáticos por email, SMS y WhatsApp.
                                Mejora la comunicación y la experiencia de tus clientes.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                <div>
  <Card
    style={{
      width: '18rem',
      textAlign: 'center',
      border: '2px solid #444',
      transition: 'all 0.3s ease',
    }}
    className="shadow-sm"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
    <Card.Img variant="top" src={escudo} alt="Segura y Confiable" />
    <Card.Body>
      <Card.Title>Segura y Confiable</Card.Title>
      <Card.Text className="text-muted">
        Céntrese en sus pacientes mientras SoftVet protege su información.
        La infraestructura en la nube garantiza seguridad y disponibilidad.
        Controle accesos y audite usuarios sin complicaciones.
      </Card.Text>
    </Card.Body>
  </Card>
</div>

<Card
    style={{
      width: '18rem',
      textAlign: 'center',
      border: '2px solid #444',
      transition: 'all 0.3s ease',
    }}
    className="shadow-sm"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
                        <Card.Img variant="top" src= {soporte} alt="Soporte de Calidad" />
                        <Card.Body>
                            <Card.Title>Soporte de Calidad</Card.Title>
                            <Card.Text className="text-muted">
                                Tu abono mensual a SoftVet trae incluido nuestro soporte de calidad.
                                Atendemos tus consultas de forma rápida y confiable.
                                ¡Estamos contigo para que tu gestión sea más simple y segura!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
      
            <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <Button
        href="#gestion"
        size="lg"
        style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1', fontWeight: '600', transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-5px)'; 
    e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
    e.target.style.backgroundColor = '#f9b700';
    e.target.style.color = '#6f42c1';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#6f42c1';
    e.target.style.color = '#ffffff';
  }}
    >
        MAS INFORMACIÓN
    </Button>
</div>
            </div>
        </>
    )
}

export default Info;