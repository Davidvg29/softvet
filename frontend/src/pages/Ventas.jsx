import HeaderApp from "../components/HeaderApp"
import Footer from "../components/landing/Footer"
import MainVentas from "../components/ventas/MainVentas"

const Ventas = ()=>{
    return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainVentas/> 
        </main>
      <Footer/>
    </div>
    )
}
export default Ventas