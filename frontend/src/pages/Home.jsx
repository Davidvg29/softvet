import Prueba from '../components/Prueba';
import Carrousel from '../components/landing/Carrousel';
import Header from '../components/landing/Header';
import SoftvetInfo from '../components/landing/SoftvetInfo';
import SoftVetGestion from '../components/landing/SoftVetGestion';
import SoftVetDemo from '../components/landing/SoftVetDemo';
import SoftVetForm from '../components/landing/SoftVetForm';
import Footer from '../components/landing/Footer';

const Home = () => {
  
  return (
    <>
      <Header/>
      <SoftVetDemo/>
       <SoftvetInfo/>
       <Carrousel/>
       <section id="gestion" className="py-5">
       <SoftVetGestion/>
      </section>
      <section id="formulario">
      <SoftVetForm/>
      </section>
      <Footer/>
    </>
  );
};
export default Home;
