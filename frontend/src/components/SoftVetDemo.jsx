import React from 'react'
import Button from 'react-bootstrap/Button'
import multidispositivo from '../assets/multidispositivo.svg';


const Demo = () => {
  return (
    <div
      style={{
        backgroundColor: '#6f42c1',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem 6rem',
        borderRadius: '20px',
        flexWrap: 'wrap', // para que se acomode en pantallas chicas
      }}
    >
      {/* Texto a la izquierda */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h1
          style={{
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: '2.8rem',
            fontWeight: '700',
            marginBottom: '2rem',
            textAlign: 'left',
          }}
        >
          Tu sistema de gestión integral veterinario
        </h1>
        <p>
            Optimizá la gestión de tu clínica con un software ágil y fácil de usar.
Automatizá tareas, ganá tiempo y enfocate en lo más importante: hacer crecer tu negocio.
        </p>

        <Button
          size="lg"
          style={{
            backgroundColor: '#f9b700',
            borderColor: '#f9b700',
            color: '#020202ff',
            fontWeight: '600'
          }}
        >
          Solicita tu demo ahora
        </Button>

        <p
          style={{color: '#f9b700', marginTop: '1rem', fontSize: '1rem'}}>
            Sin tarjeta de crédito. Sin contratos. Cancela cuando quieras.
        </p>
      </div>

      
      <div style={{ flex: '1', textAlign: 'right', minWidth: '300px', marginLeft: '5rem' }}>
        <img
          src={multidispositivo}
          alt="imagen de dispositivos"
          style={{ width: '100%', maxWidth: '800px', borderRadius: '15px' }}
        />
      </div>
    </div>
  );
};

export default Demo;