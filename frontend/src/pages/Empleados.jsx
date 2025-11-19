import React from 'react'
import MainEmpleado from '../components/empleados/MainEmpleado'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Empleados = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainEmpleado/>
        </main>
      <Footer/>
    </div>
  )
}

export default Empleados