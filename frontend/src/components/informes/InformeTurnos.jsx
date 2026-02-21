import { useState, useRef, useEffect } from "react";
import { Form, Button, Table, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { informes, empleados, clientes } from "../../endpoints/endpoints";
import logovet from "../../assets/logovet.png";
import jsPDF from "jspdf";


const InformeTurnos = () => {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");

  const [estadoTurno, setEstadoTurno] = useState("");


  const [listaClientes, setListaClientes] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);



  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const tableRef = useRef(null);


  const estados = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Realizado", label: "Realizado" },
    { value: "Cancelado", label: "Cancelado" }
  ];


  const cargarFiltros = async () => {
    try {
      // Cargar Clientes
      const resClientes = await axios.get(clientes + '/ver', { withCredentials: true });
      setListaClientes(resClientes.data);

      // Cargar Empleados
      const resEmpleados = await axios.get(empleados + '/ver', { withCredentials: true });
      setListaEmpleados(resEmpleados.data);
    } catch (err) {
      console.error("Error al cargar listas de filtros:", err);
    }
  };


  useEffect(() => {
    cargarFiltros();
  }, []);


  const generarInforme = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Debes seleccionar ambas fechas.");
      return;
    }

    setError("");
    setLoading(true);

    try {

      const res = await axios.post(
        `${informes}/turnos-fecha`,
        {
          fechaInicio,
          fechaFin,
          idCliente: idCliente || null,
          idEmpleado: idEmpleado || null,
          estadoTurno: estadoTurno || null
        },
        { withCredentials: true }
      );

      setTurnos(res.data);
    } catch (err) {
      setError("No se pudo obtener el informe de turnos.");
      console.error("Error al generar informe de turnos:", err);
    } finally {
      setLoading(false);
    }
  };


  const descargarPDF = () => {
  if (turnos.length === 0) {
    setError("No hay datos para generar el PDF.");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // LOGO
  pdf.addImage(logovet, "PNG", margin, y, 40, 20);

  // TÍTULO
  pdf.setFontSize(18);
  pdf.text("Informe de Turnos", pageWidth / 2, y + 10, { align: "center" });

  y += 30;

  // FILTROS
  const clienteFiltro =
    listaClientes.find(c => String(c.id_cliente) === idCliente)?.nombre_cliente || "Todos";

  const empleadoFiltro =
    listaEmpleados.find(e => String(e.id_empleado) === idEmpleado)?.nombre_empleado || "Todos";

  const estadoFiltro = estadoTurno || "Todos";

  pdf.setFontSize(12);
  pdf.text(`Período: ${fechaInicio} al ${fechaFin}`, margin, y);
  y += 7;
  pdf.text(`Cliente: ${clienteFiltro}`, margin, y);
  y += 7;
  pdf.text(`Empleado: ${empleadoFiltro}`, margin, y);
  y += 7;
  pdf.text(`Estado: ${estadoFiltro}`, margin, y);

  y += 15;

  // ENCABEZADO TABLA
  pdf.setFillColor(111, 66, 193);
  pdf.setTextColor(255, 255, 255);
  pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, "F");

  pdf.text("ID", margin + 2, y);
  pdf.text("Fecha/Hora", margin + 20, y);
  pdf.text("Estado", margin + 65, y);
  pdf.text("Cliente", margin + 95, y);
  pdf.text("Mascota", margin + 130, y);
  pdf.text("Empleado", margin + 160, y);

  pdf.setTextColor(0, 0, 0);
  y += 10;

  // FILAS
  turnos.forEach((t) => {

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    // Formateo fecha igual que en tabla
    let displayFecha = "N/A";
    let fechaStringLimpia = "";

    if (t.fecha instanceof Date) {
      fechaStringLimpia = t.fecha.toISOString().slice(0, 10);
    } else if (typeof t.fecha === "string") {
      fechaStringLimpia = t.fecha.slice(0, 10);
    }

    if (fechaStringLimpia) {
      const partes = fechaStringLimpia.split("-");
      if (partes.length === 3) {
        displayFecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }

    const displayHora = t.hora ? t.hora.slice(0, 5) : "N/A";

    pdf.text(String(t.id_turno), margin + 2, y);
    pdf.text(`${displayFecha} ${displayHora}`, margin + 20, y);
    pdf.text(t.estado || "", margin + 65, y);
    pdf.text(t.cliente || "", margin + 95, y);
    pdf.text(t.mascota || "", margin + 130, y);
    pdf.text(t.empleado || "", margin + 160, y);

    y += 8;
  });

  y += 10;

  pdf.setFontSize(14);
  pdf.text(
    `TOTAL TURNOS: ${turnos.length}`,
    pageWidth - margin,
    y,
    { align: "right" }
  );

  // Vista previa
  const blob = pdf.output("bloburl");
  window.open(blob, "_blank");
};


  return (
    <div>
      <h5 className="mb-3">Generar Informe de Turnos</h5>

      <Form className="mb-4">

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>


        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filtrar por Cliente (Opcional)</Form.Label>
              <Form.Select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
              >
                <option value="">— Todos los Clientes —</option>
                {listaClientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre_cliente}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filtrar por Empleado (Opcional)</Form.Label>
              <Form.Select
                value={idEmpleado}
                onChange={(e) => setIdEmpleado(e.target.value)}
              >
                <option value="">— Todos los Empleados —</option>
                {listaEmpleados.map(e => (
                  <option key={e.id_empleado} value={e.id_empleado}>
                    {e.nombre_empleado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>


          <Col md={4}>
            <Form.Group>
              <Form.Label>Filtrar por Estado (Opcional)</Form.Label>
              <Form.Select
                value={estadoTurno}
                onChange={(e) => setEstadoTurno(e.target.value)}
              >
                <option value="">— Todos los Estados —</option>
                {estados.map(e => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>


        <Row>
          <Col>
            <Button
              onClick={generarInforme}
              className="w-100 mt-2"
              style={{
                backgroundColor: "#6f42c1",
                border: "none",
                fontWeight: "bold",
                color: "#fff",
                boxShadow: "0 3px 0 #542c85",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 5px 0 #542c85";
                e.target.style.backgroundColor = "#5931a9";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 3px 0 #542c85";
                e.target.style.backgroundColor = "#6f42c1";
              }}
            >
              Generar Informe
            </Button>
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {turnos.length > 0 && !loading && (
        <div className="text-end mb-3">
          <Button
            onClick={descargarPDF}
            variant="success"
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Generando...
              </>
            ) : (
              "Descargar PDF 📄"
            )}
          </Button>
        </div>
      )}


      {turnos.length > 0 && !loading && (
        <Table striped bordered hover ref={tableRef}>
          <thead>
            <tr>
              <th>ID Turno</th>
              <th>Fecha/Hora</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Mascota</th>
              <th>Empleado</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => {

              let displayFecha = 'N/A';
              // Mantenemos la hora formateada a HH:MM
              const displayHora = t.hora ? t.hora.slice(0, 5) : 'N/A';

              // 1. CONVERSIÓN SEGURA A STRING y LIMPIEZA
              let fechaStringLimpia = 'FALLA';

              // Si es un objeto Date (como ocurría en tu caso), lo limpiamos a YYYY-MM-DD
              if (t.fecha instanceof Date) {
                fechaStringLimpia = t.fecha.toISOString().slice(0, 10);
              }
              // Si ya es una cadena (ej: "2025-11-29" o cadena ISO), tomamos el inicio
              else if (typeof t.fecha === 'string') {
                fechaStringLimpia = t.fecha.slice(0, 10);
              }

              // 2. FORMATEO (DD/MM/YYYY)
              if (fechaStringLimpia !== 'FALLA') {
                const partes = fechaStringLimpia.split('-'); // Espera ['YYYY', 'MM', 'DD']

                if (partes.length === 3) {
                  // Reordenamos: DD/MM/YYYY
                  displayFecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
                }
              }

              return (
                <tr key={t.id_turno}>
                  <td>{t.id_turno}</td>
                  {/* Usamos las variables formateadas */}
                  <td>{displayFecha} - {displayHora}</td>
                  <td>{t.estado}</td>
                  <td>{t.cliente}</td>
                  <td>{t.mascota}</td>
                  <td>{t.empleado}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {turnos.length === 0 && !loading && !error && (
        <p className="text-muted text-center">No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default InformeTurnos;