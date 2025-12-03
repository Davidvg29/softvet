import React from 'react'
import MainSucursales from '../components/sucursales/MainSucursales'
import Header from '../components/HeaderApp';
import Footer from '../components/landing/Footer';


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
