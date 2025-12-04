import { useState, useRef, useEffect } from "react";
import { Form, Button, Table, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { informes, empleados, clientes } from "../../endpoints/endpoints";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


// Función de utilidad para formatear moneda ARS

const formatCurrency = (amount) => {
  // Aseguramos que el valor sea tratado como un número.
  const numericAmount = Number(amount);

  // Usamos Intl.NumberFormat para un control de moneda robusto
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS', // Código de moneda para el peso argentino
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};


const InformeEmpleadoMasVentas = () => {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");


  const [listaClientes, setListaClientes] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [filtroError, setFiltroError] = useState("");

  const [empleadosRankeados, setEmpleadosRankeados] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const tableRef = useRef(null);


  const totalGeneral = empleadosRankeados.reduce((sum, e) => sum + Number(e.total_vendido || 0), 0);


  // Carga de Clientes y Empleados para los filtros

  const cargarFiltros = async () => {
    setFiltroError("");
    try {
      const [resClientes, resEmpleados] = await Promise.all([
        axios.get(clientes + '/ver', { withCredentials: true }),
        axios.get(empleados + '/ver', { withCredentials: true })
      ]);

      setListaClientes(Array.isArray(resClientes.data) ? resClientes.data : []);
      setListaEmpleados(Array.isArray(resEmpleados.data) ? resEmpleados.data : []);

    } catch (err) {
      console.error("Error al cargar listas de filtros:", err);

      if (err.response && err.response.status === 401) {
        setFiltroError("Error de autenticación: No se pudieron cargar los filtros. Por favor, reinicie la sesión.");
      } else {
        setFiltroError("Error al cargar clientes o empleados. Revise la conexión al servidor.");
      }
    }
  };

  useEffect(() => {
    cargarFiltros();
  }, []);


  // Generación del Informe

  const generarInforme = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Debes seleccionar ambas fechas.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${informes}/empleado-mas-ventas`,
        {
          fechaInicio,
          fechaFin,
          idCliente: idCliente || null,
          idEmpleado: idEmpleado || null
        },
        { withCredentials: true }
      );

      setEmpleadosRankeados(res.data);
    } catch (err) {
      console.error("Error al generar informe:", err);
      const mensaje = err.response && err.response.data && err.response.data.error
        ? err.response.data.error
        : "No se pudo obtener el informe de ventas. Revise la consola para detalles.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };


  // Descarga de PDF

  const descargarPDF = async () => {
    if (empleadosRankeados.length === 0 || !tableRef.current) {
      setError("No hay datos cargados para generar el PDF.");
      return;
    }

    setPdfLoading(true);
    setError("");

    try {
      const canvas = await html2canvas(tableRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calcular escala para ajustar la imagen al PDF
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio - 20; // 10mm de margen a cada lado
      const finalHeight = imgHeight * ratio - 20;
      const x = (pdfWidth - finalWidth) / 2;
      const y = 10; // Margen superior

      // Agregar título al PDF
      pdf.setFontSize(16);
      pdf.text("Informe de Ventas por Empleado", 10, 10);
      pdf.setFontSize(10);
      pdf.text(`Período: ${fechaInicio} al ${fechaFin}`, 10, 18);
      pdf.text(`Total General: ${formatCurrency(totalGeneral)}`, 10, 26);

      // Agregar tabla (ajustada para que quepa en la página después del encabezado)
      pdf.addImage(imgData, 'PNG', x, y + 25, finalWidth, finalHeight);
      pdf.save('Informe_Ventas_Empleado.pdf');

    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("Error al generar el PDF. Intente de nuevo.");
    } finally {
      setPdfLoading(false);
    }
  };


  return (
    <div>
      <h5 className="mb-3">Informe de Ventas Agrupadas por Empleado</h5>

      {filtroError && <Alert variant="warning">{filtroError}</Alert>}

      <Form className="mb-4">
        {/* FILTROS DE FECHA */}
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

        {/* FILTROS OPCIONALES DE CLIENTE Y EMPLEADO */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filtrar por Cliente (Opcional)</Form.Label>
              <Form.Select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                disabled={listaClientes.length === 0}
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
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filtrar por Empleado (Opcional)</Form.Label>
              <Form.Select
                value={idEmpleado}
                onChange={(e) => setIdEmpleado(e.target.value)}
                disabled={listaEmpleados.length === 0}
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
        </Row>

        {/* BOTÓN GENERAR */}
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


      {loading && (<div className="text-center"><Spinner animation="border" /></div>)}
      {error && <Alert variant="danger">{error}</Alert>}

      {empleadosRankeados.length > 0 && !loading && (
        <>
          <div className="text-end mb-3">
            <Button
              onClick={descargarPDF}
              variant="success"
              disabled={pdfLoading}
            >
              {pdfLoading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />Generando...</>) : ("Descargar PDF 📄")}
            </Button>
          </div>

          {/* MOSTRAR TOTAL GENERAL */}
          <div className="text-end mb-3">
            <h4>
              Total General Vendido:
              <strong className="text-primary ms-2">
                {/* FORMATO DE MONEDA APLICADO */}
                {formatCurrency(totalGeneral)}
              </strong>
            </h4>
          </div>

          {/* TABLA DEL INFORME */}
          <Table striped bordered hover ref={tableRef}>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Empleado</th>
                <th>DNI</th>
                <th>Cant. Ventas</th>
                <th>Total Vendido</th>
              </tr>
            </thead>
            <tbody>
              {empleadosRankeados.map((e, index) => (
                <tr key={e.id_empleado}>
                  <td>{index + 1}</td>
                  <td>{e.nombre_empleado}</td>
                  <td>{e.dni_empleado}</td>
                  <td>{e.cantidad_ventas}</td>
                  <td>
                    {/* FORMATO DE MONEDA APLICADO */}
                    {formatCurrency(e.total_vendido)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {empleadosRankeados.length === 0 && !loading && !error && (
        <p className="text-muted text-center">No hay empleados con ventas en el rango seleccionado.</p>
      )}
    </div>
  );
};

export default InformeEmpleadoMasVentas;