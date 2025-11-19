import React from 'react'
import MainRoles from '../components/roles/MainRoles'
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';

const Roles = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainRoles/>
        </main>
       <Footer/>
    </div>
  )
}

export default Roles
