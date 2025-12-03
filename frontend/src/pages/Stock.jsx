import React from 'react'
import MainStock from '../components/stock/MainStock'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Stock = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainStock/>
        </main>
       <Footer/>
    </div>
  )
}

export default Stock
