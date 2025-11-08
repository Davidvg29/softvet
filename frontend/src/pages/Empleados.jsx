import React from 'react'
import MainEmpleado from '../components/empleados/MainEmpleado'
import Footer from '../components/landing/Footer';
import Header from '../components/landing/Header';

const Empleados = () => {
  return (
    <div>
       <Header/>
      <MainEmpleado/>
        <Footer/>
    </div>
  )
}

export default Empleados