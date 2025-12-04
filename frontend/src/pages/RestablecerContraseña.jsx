import RestablecerContraseñaComponente from "../components/empleados/RestablecerContraseñaComponente"
import Footer from "../components/landing/Footer"
import Header from "../components/landing/Header"

const RestablecerContraseña = ()=>{
    return(
        <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <RestablecerContraseñaComponente/>
      </main>
      <Footer />
    </div>
    )
}
export default RestablecerContraseña