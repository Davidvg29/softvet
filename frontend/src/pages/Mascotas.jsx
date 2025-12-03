import React from 'react'
import MainMascotas from '../components/mascotas/MainMascotas'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Mascotas = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainMascotas/>
        </main>
      <Footer/>
    </div>
  )
}

export default Mascotas