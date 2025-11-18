import React from 'react'
import MainCliente from '../components/clientes/MainCliente'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Clientes = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainCliente/>
        </main>
      <Footer/>
    </div>
  )
}

export default Clientes