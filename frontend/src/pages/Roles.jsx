import React from 'react'
import MainRoles from '../components/roles/MainRoles'
import Footer from '../components/landing/Footer';
import Header from '../components/landing/Header';

const Roles = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
        <main className="flex-grow-1">
          <MainRoles/>
        </main>
       <Footer/>
    </div>
  )
}

export default Roles
