import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import nube from '../assets/nube.svg';
import compu from '../assets/compu.svg';
import escudo from '../assets/escudo.svg';
import soporte from '../assets/soporte.svg';

const Info = () => {

    return (
        <>

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-4 p-4 " style={{ minHeight: '100vh' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '2.8rem',
                        fontWeight: '700',
                        color: "rgba(102, 4, 168, 0.5)",
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        ¿Sentís que la gestión de tu veterinaria te consume demasiado tiempo?
                    </h1>
                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: "rgba(102, 4, 168, 0.5)",
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        Tranquilo, con SoftVet vas a poder enfocarte en lo que realmente importa: tus pacientes.
                    </h1>

                </div>
                <div>
                    <Card style={{ width: '18rem', textAlign: 'center'}} className="shadow-sm">
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
                    <Card style={{ width: '18rem', textAlign:'center' }} className="shadow-sm">
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
                    <Card style={{ width: '18rem', textAlign: 'center' }} className="shadow-sm">
                        <Card.Img variant="top" src= {escudo} alt="Segura y Confiable" />
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

                <div>
                    <Card style={{ width: '18rem', textAlign: 'center' }} className="shadow-sm">
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
            </div>
            <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <Button
        href="/login"
        size="lg"
        style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
    >
        ¡Comenzá tu prueba gratuita ahora!
    </Button>
</div>
            </div>
        </>
    )
}

export default Info;