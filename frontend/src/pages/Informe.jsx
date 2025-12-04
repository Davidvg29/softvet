import React from 'react'
import { MainInforme } from '../components/informes/MainIforme'
import HeaderApp from '../components/HeaderApp'
import Footer from '../components/landing/Footer'

const Informe = () => {
    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <HeaderApp />
                <main className="flex-grow-1">
                <MainInforme />
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Informe