import IniciarSesion from "../components/iniciarSesion/IniciarSesion"
import Footer from "../components/landing/Footer"
import Header from "../components/landing/Header"

const Login = ()=>{
    return(
        <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <IniciarSesion />
      </main>
      <Footer />
    </div>
    )
}
export default Login