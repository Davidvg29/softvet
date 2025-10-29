import React from 'react'
import Card from 'react-bootstrap/Card';
import card1 from '../../assets/card1.svg';
import card2 from '../../assets/card2.svg';
import card3 from '../../assets/card3.svg';

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
                        color: '#a52af1ff',
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
        <div className='d-flex flex-wrap justify-content-center align-items-center'>
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
    </div>
    </>
  )
}

export default Gestion;
