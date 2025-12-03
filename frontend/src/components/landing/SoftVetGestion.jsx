import React from 'react'
import Card from 'react-bootstrap/Card';
import card1 from '../../assets/card1.svg';
import card2 from '../../assets/card2.svg';
import card3 from '../../assets/card3.svg';
import card4 from '../../assets/card4.svg';
import card5 from '../../assets/card5.svg';
import card6 from '../../assets/card6.svg';
import card7 from '../../assets/card7.svg';
import card8 from '../../assets/card8.svg';

const Gestion = () => {

  const card = [
          {
            id: 1,
            img : card1,
            titulo: "Gestion de Clientes y Pacientes",
            descripcion: "Toda la información necesaria al alcance de un click."
          },
          {
            id: 2,
            img : card2,
            titulo: "Gestion de Historias Clínicas",
            descripcion: "Accede y gestiona las historias clínicas de tus pacientes."
          },
          {
            id: 3,
            img : card3,
            titulo: "Gestion de Agenda y Turnos",
            descripcion: "Gestiona los turnos de tu clínica fácilmente."
          },
          {
            id: 4,
            img : card4,
            titulo: "Gestion de Productos y Stock",
            descripcion: "Controla el inventario y las ventas de tu clínica."
          },
          {
            id: 5,
            img : card5,
            titulo: "Gestion de Compras y Proveedores",
            descripcion: "Administra las compras y relaciones con proveedores."
          },
          {
            id: 6,
            img : card8,
            titulo: "Gestion de Ventas",  
            descripcion: "Realiza y controla las ventas de manera eficiente."
          },
          {
            id: 7,
            img : card7,
            titulo: "Control Total de usuarios",
            descripcion: "Administra los accesos y permisos de tu equipo."
          },
          {
            id: 8,
            img : card6,
            titulo: "Seguridad y Respaldo de Datos",
            descripcion: "Seguridad total para tus datos y los de tus clientes."
          }
  ];



  return (
    <>
      <div>
        <div>
            <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '2.8rem',
                        fontWeight: '700',
                        color: '#8921caff',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        SOFTVET Gestión
                    </h1>
                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '350',
                        color: '#040206ff',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        Simplifica tus tareas, ahorra tiempo y{''} <span style={{color: '#040206ff', fontWeight: '700'}}>brinda el mejor cuidado a tus pacientes.</span> {''}
                    </h1>

                    <h1 style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#040206ff',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                      ¡Es hora de llevar tu clínica al siguiente nivel!
                    </h1>
        </div>
</div>

<div className='d-flex flex-column justify-content-center align-items-center w-100'>
        <div className='d-flex flex-wrap justify-content-center align-items-center' style={{ marginBottom: '2rem' }}>
        {card.map((carta)=> (
            <Card key={carta.id} className= 'm-1'style={{ width: '18rem', border: 'none' }}>
      {carta.img && <Card.Img variant="top" src={carta.img} style={{ margin: '0', padding:'0' }}/>}
      <Card.Body>
        <Card.Title style={{
          fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#040206ff',
                        textAlign: 'center',
                        marginBottom: '0.5'}}>{carta.titulo}</Card.Title>
        <Card.Text style={{
          fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#471a74ff',
                        textAlign: 'center',
                        marginBottom: '0'}}>{carta.descripcion}</Card.Text>
      </Card.Body>
    </Card>
        ))}
        </div>

        <p style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#040206ff',
                        textAlign: 'center'
                    }}> Y MUCHO MÁS... </p>
    </div>
    </>
  )
}

export default Gestion;
