import React from 'react'
import HeaderApp from '../components/HeaderApp.jsx';
import Footer from '../components/landing/Footer.jsx';
import MainHistoriaClinica from '../components/HistoriaClinica/MainHistoriaClinica.jsx';

const HistoriaClinica = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
      <HeaderApp />
      <main className="flex-grow-1">
        <MainHistoriaClinica />
      </main>
      <Footer />
    </div>
    )
}

export default HistoriaClinica