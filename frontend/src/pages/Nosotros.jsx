import React from 'react'
import Cards from '../components/nosotros'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Nosotros = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <Cards/>
        </main>
      <Footer/>
    </div>
  )
}

export default Nosotros;