import React from 'react'
import MainEspecies from '../components/especies/MainEspecies';
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Especies = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainEspecies/>
        </main>
      <Footer/>
    </div>
  )
}

export default Especies
