import Prueba from '../components/Prueba';
import Carrousel from '../components/Carrousel';
import Header from '../components/Header';
import SoftvetInfo from '../components/SoftvetInfo';
import SoftVetGestion from '../components/SoftvetGestion';
import SoftVetDemo from '../components/SoftVetDemo';

const Home = () => {
  return (
    <>
      <Header/>
      <SoftVetDemo/>
      <Carrousel/>
       <SoftvetInfo/>
       <section id="gestion" className="py-5">
       <SoftVetGestion/>
      </section>
    </>
  );
};
export default Home;
