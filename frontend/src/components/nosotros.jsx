import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import angel from "../assets/angel.svg";
import joaquin from "../assets/joaquin.svg";
import david from "../assets/david.svg";
import mariano from "../assets/mariano.svg";

function Cards() {

    const card = [
        {
            id: 1,
            img : angel,
            titulo: "ANGEL PASTRANA",
            descripcion: "Apasionado por crear experiencias digitales intuitivas y funcionales con tecnologías modernas.",
            link: "https://www.linkedin.com/in/angel-pastrana-b7856223b/"
        },
        {
            id: 2,
            img: joaquin,
            titulo: "JOAQUIN DIAZ",
            descripcion: "Especializado en desarrollo frontend, enfocado en diseño responsivo y rendimiento web.",
            link: "https://ar.linkedin.com/in/joaquin-diaz-85b420364"
        },
        {
            id: 3,
            img: david,
            titulo: "DAVID VALDEZ GRAMAJO",
            descripcion:"Desarrollador full stack con habilidades en React, Node.js y bases de datos.",
            link: "https://www.linkedin.com/in/davidvaldezgramajo/"
        },
        {
            id: 4,
            img: mariano,
            titulo: "MARIANO CELIZ",
            descripcion: "Me gusta resolver problemas con código limpio, reutilizable y bien estructurado.",
            link: "https://www.linkedin.com/in/mariano-celiz-1b6506291"
        }
    ]

  return (
    <div className='d-flex flex-column justify-content-center align-items-center w-100'>

        {/* TITULO */}
        <div className="text-center">
            <h1
            className="fw-bold animate-title p-2 mb-2 d-inline-block"
            style={{
                background: "linear-gradient(90deg, #6f42c1, #8f41aeff)",
                fontSize: "2.5rem",
                color: "#fff",
                marginTop: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                borderRadius: "12px",
                padding: "12px 25px"
            }}
            >
                Quiénes somos
            </h1>
        </div>

        {/* ANIMACION TITULO */}
        <style>
            {`
            .animate-title {
                opacity: 0;
                transform: translateY(10px);
                animation: fadeSlide 0.6s ease-out forwards;
            }

            @keyframes fadeSlide {
                from {
                opacity: 0;
                transform: translateY(10px);
                }
                to {
                opacity: 1;
                transform: translateY(0);
                }
            }

            .card-softvet:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(111, 66, 193, 0.35);
            }
            `}
        </style>

        <p style={{ fontSize: "1.2rem", marginTop: "5px", color: "#444" }}>
            Los desarrolladores que creamos esto
        </p>

        {/* TARJETAS */}
        <div className='d-flex flex-wrap justify-content-center align-items-center'>
            {card.map((carta)=> (
                <Card 
                    key={carta.id} 
                    className='m-3 card-softvet'
                    style={{ 
                        width: '19rem',
                        borderRadius: "15px",
                        border: "2px solid #6f42c1",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                        textAlign: "center",
                        paddingBottom: "15px"
                    }}
                >

                {/* Imagen estilo avatar */}
                {carta.img && (
                    <Card.Img 
                        variant="top" 
                        src={carta.img} 
                        style={{
                            width: "130px",
                            height: "130px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            margin: "15px auto 0 auto",
                            border: "3px solid #6f42c1",
                            padding: "5px"
                        }}
                    />
                )}

                <Card.Body>
                    <Card.Title 
                        style={{ 
                            fontWeight: "bold", 
                            fontSize: "1.3rem", 
                            color: "#6f42c1" 
                        }}
                    >
                        {carta.titulo}
                    </Card.Title>

                    <Card.Text style={{ color: "#555", minHeight: "70px" }}>
                        {carta.descripcion}
                    </Card.Text>

                    <Button
                        onClick={() => window.open(carta.link, '_blank')}
                        style={{
                            background: "linear-gradient(90deg, #6f42c1, #bb2cf4)",
                            border: "none",
                            padding: "10px 25px",
                            fontWeight: "bold",
                            color: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 3px 0 #4b2c92",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 5px 0 #4b2c92";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 3px 0 #4b2c92";
                        }}
                    >
                        CONTACTO
                    </Button>

                </Card.Body>
                </Card>
            ))}
        </div>
    </div>
  );
}

export default Cards;