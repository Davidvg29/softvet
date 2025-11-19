import React from 'react'
import MainProducto from '../components/productos/MainProducto'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Productos = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainProducto/>
        </main>
      <Footer/>
    </div>
  )
}

export default Productos