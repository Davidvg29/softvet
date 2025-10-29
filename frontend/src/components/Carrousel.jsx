import Carousel from 'react-bootstrap/Carousel';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import carrousel1 from '../assets/carrousel1.svg';
import carrousel2 from '../assets/carrousel2.svg';
import carrousel3 from '../assets/carrousel3.svg';
import carrousel4 from '../assets/carrousel4.svg';
 
function Carrusel() {

  useEffect(() => {
    const prev = document.querySelector('.carousel-control-prev');
    const next = document.querySelector('.carousel-control-next');
    if (prev) {
      prev.style.width = 'auto';
      prev.style.background = 'transparent';
    }
    if (next) {
      next.style.width = 'auto';
      next.style.background = 'transparent';
    }
  }, []);

  return (
    <Carousel
      interval={3000}
      className="overflow-hidden p-0"
      prevIcon={
        <span
          className="carousel-control-prev-icon"
          style={{
            transform: 'scale()',
            opacity: 0.7,
            filter: 'brightness(0) invert(1)',
          }}
        />
      }
      nextIcon={
        <span
          className="carousel-control-next-icon"
          style={{
            transform: 'scale(2)',
            opacity: 0.7,
            filter: 'brightness(0) invert(1)',
          }}
        />
      }
      prevLabel=""
      nextLabel=""
    >
      <Carousel.Item className= 'position-relative'>
        <img 
    className="d-block w-100 rounded-5"
    src={carrousel1}
    alt="First slide"
    style={{ objectFit: "cover",
      height: '700px'
     }}
        />
          <Button
          size="lg"
          className= 'position-absolute bottom-0 start-0 ms-5 m-4'
          style={{
    backgroundColor: '#f9b700',
    borderColor: '#f9b700',
    color: '#020202ff',
    fontWeight: '600',
    transition: 'transform 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Solicita Tu Demo Ahora ➨
        </Button>
      </Carousel.Item>

      <Carousel.Item className='position-relative'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel2}
      alt="First slide"
      style={{ objectFit: "cover",
        height: '700px'
       }}
        />
          <Button
          size="lg"
          className="position-absolute bottom-0 start-0 ms-5 m-4"
          style={{
    backgroundColor: '#f9b700',
    borderColor: '#f9b700',
    color: '#020202ff',
    fontWeight: '600',
    transition: 'transform 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Solicita Tu Demo Ahora ➨
        </Button>
      </Carousel.Item>

      <Carousel.Item className='position-relative'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel3}
      alt="First slide"
      style={{ objectFit: "cover",
        height: '700px'
       }}
        />
          <Button
          size="lg"
          className="position-absolute bottom-0 start-0 ms-5 m-4"
          style={{
    backgroundColor: '#f9b700',
    borderColor: '#f9b700',
    color: '#020202ff',
    fontWeight: '600',
    transition: 'transform 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Solicita Tu Demo Ahora ➨
        </Button>
      </Carousel.Item>

      <Carousel.Item className='position-relative'>
        <img
      className="d-block w-100 rounded-5"
      src={carrousel4}
      alt="First slide"
      style={{ objectFit: "cover",
        height: '700px'
       }}
        />
          <Button
          size="lg"
          className="position-absolute bottom-0 start-0 ms-5 m-4"
          style={{
    backgroundColor: '#f9b700',
    borderColor: '#f9b700',
    color: '#020202ff',
    fontWeight: '600',
    transition: 'transform 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Solicita Tu Demo Ahora ➨
        </Button>
      </Carousel.Item>
    </Carousel>
  );
}

export default Carrusel;