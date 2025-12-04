import MailRestablecerContraseñaComponente from "../components/empleados/MailRestablecerContraseñaComponente"
import Footer from "../components/landing/Footer"
import Header from "../components/landing/Header"

const MailRestablecerContraseña = ()=>{
    return(
        <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <MailRestablecerContraseñaComponente/>
      </main>
      <Footer />
    </div>
    )
}
export default MailRestablecerContraseña