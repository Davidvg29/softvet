
import Footer from '../components/landing/Footer';
import HeaderApp from '../components/HeaderApp';
import MainAuditoriasMovimientos from '../components/auditoriasMovimientos/MainAuditoriasMovimientos';

const AuditoriasMovimientosPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderApp/>
        <main className="flex-grow-1">
          <MainAuditoriasMovimientos/>
        </main>
      <Footer/>
    </div>
  )
}

export default AuditoriasMovimientosPage