import React from 'react'
import MainEmpleado from '../components/empleados/MainEmpleado'
import Footer from '../components/landing/Footer';
import Header from '../components/landing/Header';

const Empleados = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
        <main className="flex-grow-1">
          <MainEmpleado/>
        </main>
      <Footer/>
    </div>
  )
}

export default Empleados