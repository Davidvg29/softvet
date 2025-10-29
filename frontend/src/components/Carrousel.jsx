import Carousel from 'react-bootstrap/Carousel';
import carrousel1 from '../assets/carrousel1.svg';
import carrousel2 from '../assets/carrousel2.svg';
import carrousel3 from '../assets/carrousel3.svg';
import carrousel4 from '../assets/carrousel4.svg';
 
function Carrusel() {
  return (
    <Carousel interval={3000} className='rounded-5 p-2 p-md-4 p-lg-5 '>
      <Carousel.Item className='bg-primary rounded-5'>
        <img 
    className="d-block w-100 rounded-5"
    src={carrousel1}
    alt="First slide"
    style={{ height: "", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item className='rounded-5'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel2}
      alt="First slide"
      style={{ height: "", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item className='rounded-5'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel3}
      alt="First slide"
      style={{ height: "", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item className='rounded-5'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel4}
      alt="First slide"
      style={{ height: "", objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Carrusel;