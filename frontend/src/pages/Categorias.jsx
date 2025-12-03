import React from 'react'
import MainCategorias from '../components/categorias/MainCategorias';
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Categorias = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainCategorias/>
        </main>
      <Footer/>
    </div>
  )
}

export default Categorias