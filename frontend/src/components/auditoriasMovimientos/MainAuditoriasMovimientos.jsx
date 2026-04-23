import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import * as XLSX from 'xlsx'; // <-- Nueva importación

const MainAuditoriasMovimientos = () => {
  const [auditoriasMovimientos, setAuditoriasMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 4; // Puedes cambiar este número para mostrar más o menos

  useEffect(() => {
    const getAuditoriasMovimientos = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/auditoriasMovimientos/ver', {
          withCredentials: true,
        });
        setAuditoriasMovimientos(data.reverse());
      } catch (error) {
        console.error('Error fetching auditorias y movimientos:', error);
      }
    };
    getAuditoriasMovimientos();
  }, []);

  // 1. Primero filtramos por la búsqueda
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

  // 2. Luego calculamos qué porción del arreglo mostrar según la página
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

  // Función para descargar Excel
  const handleDescargarExcel = () => {
    // data con nombres de columnas amigables
    const datosParaExcel = auditoriasFiltradas.map((auditoria) => ({
      'Fecha y Hora': formatearFecha(auditoria.fecha_hora),
      'Módulo': auditoria.modulo,
      'Acción': auditoria.accion,
      'Descripción': auditoria.descripcion,
      'Nombre Empleado': auditoria.nombre_empleado,
      'DNI Empleado': auditoria.dni_empleado
    }));

    // hoja de trabajo (worksheet) a partir del JSON
    const hoja = XLSX.utils.json_to_sheet(datosParaExcel);

    //  ancho de las columnas para que se vea mejor
    const anchosColumnas = [
      { wch: 20 }, // Fecha y Hora
      { wch: 15 }, // Módulo
      { wch: 15 }, // Acción
      { wch: 50 }, // Descripción
      { wch: 25 }, // Nombre Empleado
      { wch: 15 }  // DNI Empleado
    ];
    hoja['!cols'] = anchosColumnas;

    //Creamos el libro de trabajo (workbook) y agregamos la hoja
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Auditorias");

    // Guardamos el archivo
    XLSX.writeFile(libro, "Reporte_Auditorias.xlsx");
  };

  // Botones de estilo para la paginación
  const botonPaginacionStyle = {
    backgroundColor: "#6f42c1",
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 4px 0 #59359a",
    transition: "all 0.1s ease",
    padding: "8px 20px",
    borderRadius: "10px"
  };

  // Estilo para el botón de Excel
  const botonExcelStyle = {
    backgroundColor: "#198754",
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 4px 0 #146c43",
    transition: "all 0.1s ease",
    padding: "10px 20px",
    borderRadius: "10px",
    marginLeft: "15px",
    whiteSpace: "nowrap"
  };

  return (
    <>
      <div className="text-center">
        <h1
          className="fw-bold animate-title p-2 mb-2 d-inline-block"
          style={{
            background: "linear-gradient(90deg, #6f42c1, #8f41aeff)",
            fontSize: "2.5rem",
            color: "#ffffffff",
            marginTop: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            borderRadius: "12px",
          }}
        >
          <i className="bi bi-clock-history" style={{ marginRight: "8px" }}></i>
          AUDITORIAS
        </h1>
      </div>

      <style>
        {`
          .animate-title {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeSlide 0.6s ease-out forwards;
          }

          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="w-100 d-flex justify-content-center align-items-center flex-column mb-5">
        
        {/* Buscador y Botón de Descarga */}
        <div className="d-flex justify-content-center align-items-center m-3 w-75">
          <Form.Control
            type="text"
            placeholder="Buscar por módulo, acción, empleado o descripción..."
            className="w-50"
            style={{ width: '700px' }}
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Volvemos a la pag 1 si cambia la búsqueda
            }}
          />
          
          <Button 
            style={botonExcelStyle}
            onClick={handleDescargarExcel}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <i className="bi bi-file-earmark-excel me-2"></i>
            Descargar Excel
          </Button>
        </div>

        {/* Contenedor principal de la tabla y paginación */}
        <div
          style={{
            border: "3px solid #6f42c1",
            borderRadius: "16px",
            padding: "25px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "95%",
            maxWidth: "1200px",
            marginTop: "30px",
          }}
        >
          <Table
            hover
            responsive
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 12px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "16px",
                  borderRadius: "10px",
                }}
              >
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>Fecha y Hora</th>
                <th style={{ padding: "14px" }}>Módulo</th>
                <th style={{ padding: "14px" }}>Acción</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Descripción</th>
                <th style={{ padding: "14px", borderTopRightRadius: "10px" }}>Empleado</th>
              </tr>
            </thead>

            <tbody>
              {auditoriasPaginadas.length > 0 ? (
                auditoriasPaginadas.map((auditoria) => (
                  <tr
                    key={auditoria.id_auditoria_movimiento}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      transform: "translateY(0)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#333",
                        border: "none",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {formatearFecha(auditoria.fecha_hora)}
                    </td>

                    <td style={{ padding: "14px 20px", fontWeight: "bold", textAlign: "center", color: "#6f42c1", border: "none" }}>
                      {auditoria.modulo}
                    </td>

                    <td style={{ padding: "14px 20px", fontWeight: "bold", textAlign: "center", border: "none", color: auditoria.accion === 'CREAR' ? '#1ab637' : auditoria.accion === 'ACTUALIZAR' ? '#ffc107' : '#dc3545' }}>
                      {auditoria.accion}
                    </td>

                    <td style={{ padding: "14px 20px", color: "#555", border: "none" }}>
                      {auditoria.descripcion}
                    </td>

                    <td style={{ padding: "14px 20px", textAlign: "center", color: "#333", border: "none" }}>
                      <strong>{auditoria.nombre_empleado}</strong> <br/>
                      <span style={{ fontSize: "0.85rem", color: "#777" }}>DNI: {auditoria.dni_empleado}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron registros de auditoría.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Controles de Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Button
                style={{
                  ...botonPaginacionStyle,
                  opacity: paginaActual === 1 ? 0.5 : 1,
                  cursor: paginaActual === 1 ? 'not-allowed' : 'pointer'
                }}
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </Button>
              
              <span 
                className="mx-4" 
                style={{ fontWeight: "bold", color: "#6f42c1", fontSize: "1.1rem" }}
              >
                Página {paginaActual} de {totalPaginas}
              </span>

              <Button
                style={{
                  ...botonPaginacionStyle,
                  opacity: paginaActual === totalPaginas ? 0.5 : 1,
                  cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer'
                }}
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MainAuditoriasMovimientos;