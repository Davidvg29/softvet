import Footer from '../components/landing/Footer';
import Header from '../components/landing/Header';
import MainTurnos from '../components/turnos/MainTurnos';

const Turnos = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
        <main className="flex-grow-1">
          <MainTurnos/>
        </main>
       <Footer/>
    </div>
  )
}

export default Turnos
