import React from 'react'
import MainSucursales from '../components/sucursales/MainSucursales'
import Footer from '../components/landing/Footer';
import Header from '../components/landing/Header';

const Sucursales = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
        <main className="flex-grow-1">
          <MainSucursales/>
        </main>
       <Footer/>
    </div>
  )
}

export default Sucursales
