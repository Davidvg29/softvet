import React from 'react'
import MainProveedores from '../components/proveedores/MainProveedores'
import Footer from '../components/landing/Footer'
import HeaderApp from '../components/HeaderApp'

const Proveedores = () => {
  return (
     <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainProveedores/>
        </main>
      <Footer/>
    </div>
  )
}

export default Proveedores