import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import * as XLSX from 'xlsx';

const MainAuditoriasMovimientos = () => {
  const [auditoriasMovimientos, setAuditoriasMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  // Función auxiliar para obtener fechas en formato YYYY-MM-DD
  const obtenerFechaFormateada = (diasRestar = 0) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - diasRestar);
    // Convertimos a formato local ISO (para evitar desfases de zona horaria)
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBuscarPorFechas = async (overrideDesde = null, overrideHasta = null) => {
    const fDesde = overrideDesde || fechaDesde;
    const fHasta = overrideHasta || fechaHasta;

    if (!fDesde || !fHasta) {
      alert('Por favor, selecciona ambas fechas (Desde y Hasta).');
      return;
    }

    if (new Date(fDesde) > new Date(fHasta)) {
      alert('La "Fecha Desde" no puede ser mayor a la "Fecha Hasta".');
      return;
    }

    try {
      const { data } = await axios.get('http://localhost:8000/auditoriasMovimientos/ver', {
        params: { fechaDesde: fDesde, fechaHasta: fHasta },
        withCredentials: true,
      });
      setAuditoriasMovimientos(data.reverse());
      setPaginaActual(1);
    } catch (error) {
      console.error('Error fetching auditorias y movimientos:', error);
      alert('Hubo un error al buscar las auditorías.');
    }
  };

  const handleFiltroRapido = (diasAtras) => {
    const hoy = obtenerFechaFormateada(0);
    const desde = obtenerFechaFormateada(diasAtras);
    
    setFechaDesde(desde);
    setFechaHasta(hoy);
    
    handleBuscarPorFechas(desde, hoy);
  };

  const auditoriasFiltradas = auditoriasMovimientos.filter((auditoria) => {
    const termino = busqueda.toLowerCase();
    return (
      (auditoria.modulo || "").toLowerCase().includes(termino) ||
      (auditoria.accion || "").toLowerCase().includes(termino) ||
      (auditoria.descripcion || "").toLowerCase().includes(termino) ||
      (auditoria.nombre_empleado || "").toLowerCase().includes(termino) ||
      (auditoria.dni_empleado || "").includes(termino)
    );
  });

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const auditoriasPaginadas = auditoriasFiltradas.slice(indicePrimerElemento, indiceUltimoElemento);
  
  const totalPaginas = Math.ceil(auditoriasFiltradas.length / elementosPorPagina);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleDescargarExcel = () => {
    if (auditoriasFiltradas.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const datosParaExcel = auditoriasFiltradas.map((auditoria) => ({
      'Fecha y Hora': formatearFecha(auditoria.fecha_hora),
      'Módulo': auditoria.modulo,
      'Acción': auditoria.accion,
      'Descripción': auditoria.descripcion,
      'Nombre Empleado': auditoria.nombre_empleado,
      'DNI Empleado': auditoria.dni_empleado
    }));

    const hoja = XLSX.utils.json_to_sheet(datosParaExcel);
    hoja['!cols'] = [ { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 50 }, { wch: 25 }, { wch: 15 } ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Auditorias");
    XLSX.writeFile(libro, "Reporte_Auditorias.xlsx");
  };

  // --- ESTILOS ---
  const botonPaginacionStyle = {
    backgroundColor: "#6f42c1", border: "none", fontWeight: "bold", color: "#fff",
    boxShadow: "0 4px 0 #59359a", transition: "all 0.1s ease", padding: "8px 20px", borderRadius: "10px"
  };

  const botonAccionStyle = {
    backgroundColor: "#6f42c1", border: "none", fontWeight: "bold", color: "#fff",
    boxShadow: "0 4px 0 #59359a", transition: "all 0.1s ease", padding: "10px 20px", borderRadius: "10px", whiteSpace: "nowrap"
  };

  const botonExcelStyle = {
    ...botonAccionStyle, backgroundColor: "#198754", boxShadow: "0 4px 0 #146c43",
  };

  const botonRapidoStyle = {
    backgroundColor: "#e2d9f3", color: "#6f42c1", border: "1px solid #6f42c1",
    fontWeight: "bold", transition: "all 0.15s ease", padding: "8px 15px", borderRadius: "8px", whiteSpace: "nowrap"
  };

  const botonLimpiar = ()=>{
    setAuditoriasMovimientos([]);
    setFechaDesde('');
    setFechaHasta('');
    setBusqueda('');
  }

  return (
    <>
      <div className="text-center">
        <h1
          className="fw-bold animate-title p-2 mb-2 d-inline-block"
          style={{
            background: "linear-gradient(90deg, #6f42c1, #8f41aeff)", fontSize: "2.5rem", color: "#ffffffff",
            marginTop: "10px", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "12px",
          }}
        >
          <i className="bi bi-clock-history" style={{ marginRight: "8px" }}></i>
          AUDITORIAS
        </h1>
      </div>

      <style>
        {`
          .animate-title { opacity: 0; transform: translateY(10px); animation: fadeSlide 0.6s ease-out forwards; }
          @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .btn-rapido:hover { background-color: #6f42c1 !important; color: white !important; }
        `}
      </style>

      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">
        
        <div className="d-flex flex-wrap justify-content-center align-items-center m-3 gap-3 w-100" style={{ maxWidth: '1200px' }}>
          
          {/* Fila superior: Filtros de fecha y Botones Rápidos */}
          <div className="d-flex align-items-center gap-2 p-3 bg-light rounded shadow-sm border flex-wrap" style={{ borderColor: '#e0e0e0' }}>
            <span className="fw-bold text-secondary">Desde:</span>
            <Form.Control 
              type="date" 
              value={fechaDesde} 
              onChange={(e) => setFechaDesde(e.target.value)} 
              style={{ width: 'auto' }}
            />
            
            <span className="fw-bold text-secondary ms-2">Hasta:</span>
            <Form.Control 
              type="date" 
              value={fechaHasta} 
              onChange={(e) => setFechaHasta(e.target.value)} 
              style={{ width: 'auto' }}
            />

            <Button 
              style={botonAccionStyle} 
              onClick={() => handleBuscarPorFechas()}
              className=""
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="bi bi-search "></i> 
            </Button>
            <Button 
              style={botonAccionStyle} 
              onClick={() => botonLimpiar()}
              className=""
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="bi bi-trash3"></i>
            </Button>

            <div className="d-flex gap-2 ms-3 border-start ps-3" style={{ borderColor: '#ccc' }}>
              <Button 
                style={botonRapidoStyle} 
                className="btn-rapido"
                onClick={() => handleFiltroRapido(1)}
              >
                Último día
              </Button>
              <Button 
                style={botonRapidoStyle} 
                className="btn-rapido"
                onClick={() => handleFiltroRapido(3)}
              >
                Últimos 3 días
              </Button>
            </div>
          </div>

          {/* Fila inferior: Búsqueda rápida y Excel */}
          <div className="d-flex align-items-center justify-content-center gap-3 ">
            <Form.Control
              type="text"
              placeholder="Buscar por módulo, acción, empleado..."
              style={{ width: '350px' }}
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              disabled={auditoriasMovimientos.length === 0}
            />
            
            <Button 
              style={botonExcelStyle}
              onClick={handleDescargarExcel}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="bi bi-file-earmark-excel me-2"></i>
              Excel
            </Button>
          </div>

        </div>

        {/* --- TABLA (Igual que antes) --- */}
        <div style={{ border: "3px solid #6f42c1", borderRadius: "16px", padding: "25px", backgroundColor: "#f8f9fa", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", width: "95%", maxWidth: "1200px", marginTop: "10px" }}>
          <Table hover responsive style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #6f42c1, #9b59b6)", color: "#fff", textAlign: "center", fontSize: "16px", borderRadius: "10px" }}>
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>N°</th>
                <th style={{ padding: "14px" }}>Fecha y Hora</th>
                <th style={{ padding: "14px" }}>Módulo</th>
                <th style={{ padding: "14px" }}>Acción</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Descripción</th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>Empleado</th>
              </tr>
            </thead>

            <tbody>
              {auditoriasMovimientos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
                    <i className="bi bi-calendar-event fs-1 d-block mb-2"></i>
                    Seleccione un rango de fechas y haga clic en Buscar para cargar los datos.
                  </td>
                </tr>
              ) : auditoriasPaginadas.length > 0 ? (
                auditoriasPaginadas.map((auditoria) => (
                  <tr key={auditoria.id_auditoria_movimiento} style={{ backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "12px", transition: "transform 0.15s ease, box-shadow 0.15s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"; }}>
                    <td style={{ padding: "14px 20px", fontWeight: "bold", textAlign: "center", color: "#6f42c1", border: "none" }}>{auditoria.id_auditoria_movimiento}</td>
                    <td style={{ padding: "14px 20px", fontWeight: "500", textAlign: "center", color: "#333", border: "none", whiteSpace: "nowrap" }}>{formatearFecha(auditoria.fecha_hora)}</td>
                    <td style={{ padding: "14px 20px", fontWeight: "bold", textAlign: "center", color: "#6f42c1", border: "none" }}>{auditoria.modulo}</td>
                    <td style={{ padding: "14px 20px", fontWeight: "bold", textAlign: "center", border: "none", color: auditoria.accion === 'CREAR' ? '#1ab637' : auditoria.accion === 'ACTUALIZAR' ? '#ffc107' : '#dc3545' }}>{auditoria.accion}</td>
                    <td style={{ padding: "14px 20px", color: "#555", border: "none" }}>{auditoria.descripcion}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", color: "#333", border: "none" }}><strong>{auditoria.nombre_empleado}</strong> <br/><span style={{ fontSize: "0.85rem", color: "#777" }}>DNI: {auditoria.dni_empleado}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No se encontraron registros para la búsqueda actual.</td></tr>
              )}
            </tbody>
          </Table>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Button style={{ ...botonPaginacionStyle, opacity: paginaActual === 1 ? 0.5 : 1, cursor: paginaActual === 1 ? 'not-allowed' : 'pointer' }} disabled={paginaActual === 1} onClick={() => {setPaginaActual(paginaActual - 1); window.scrollTo({ top: 0, behavior: 'smooth' })}}>Anterior</Button>
              <span className="mx-4" style={{ fontWeight: "bold", color: "#6f42c1", fontSize: "1.1rem" }}>Página {paginaActual} de {totalPaginas}</span>
              <Button style={{ ...botonPaginacionStyle, opacity: paginaActual === totalPaginas ? 0.5 : 1, cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer' }} disabled={paginaActual === totalPaginas} onClick={() => {setPaginaActual(paginaActual + 1); window.scrollTo({ top: 0, behavior: 'smooth' });}}>Siguiente</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainAuditoriasMovimientos;