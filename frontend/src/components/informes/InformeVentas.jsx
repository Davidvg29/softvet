import { useState, useRef, useEffect } from "react";
import { Form, Button, Table, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

import { informes, empleados, clientes } from "../../endpoints/endpoints";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const InformeVentas = () => {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");


  const [listaClientes, setListaClientes] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);


  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const tableRef = useRef(null);

  // Función para obtener los clientes y empleados
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
      // Puedes establecer un error específico si falla la carga inicial
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
        `${informes}/ventas-fecha`,
        {
          fechaInicio,
          fechaFin,
          idCliente: idCliente || null,
          idEmpleado: idEmpleado || null
        },
        { withCredentials: true }
      );

      setVentas(res.data);
    } catch (err) {
      setError("No se pudo obtener el informe de ventas.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    if (ventas.length === 0 || !tableRef.current) {
      setError("No hay datos cargados para generar el PDF.");
      return;
    }

    setPdfLoading(true);

    try {
      const input = tableRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 200;
      const pageHeight = 290;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 5;

      // Obtener nombres para el PDF usando los IDs seleccionados
      const clienteFiltro = listaClientes.find(c => String(c.id_cliente) === idCliente)?.nombre_cliente || 'Todos';
      const empleadoFiltro = listaEmpleados.find(e => String(e.id_empleado) === idEmpleado)?.nombre_empleado || 'Todos';

      pdf.setFontSize(14);
      pdf.text("Informe de Ventas por Fecha", 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Período: ${fechaInicio} al ${fechaFin}`, 10, 22);
      pdf.text(`Cliente: ${clienteFiltro} | Empleado: ${empleadoFiltro}`, 10, 29);

      position = 35;

      pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Informe_Ventas_${fechaInicio}_a_${fechaFin}.pdf`);

    } catch (err) {
      console.error("Error al generar el PDF:", err);
      setError("Ocurrió un error al generar el archivo PDF.");
    } finally {
      setPdfLoading(false);
    }
  };


  return (
    <div>
      <h5 className="mb-3">Generar Informe de Ventas</h5>

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



      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {ventas.length > 0 && !loading && (
        <div className="text-end mb-3">
          <Button
            onClick={descargarPDF}
            variant="success"
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Generando...
              </>
            ) : (
              "Descargar PDF 📄"
            )}
          </Button>
        </div>
      )}

      {ventas.length > 0 && !loading && (
        <Table striped bordered hover ref={tableRef}>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Monto Total</th>
              <th>Fecha/Hora</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>{v.cliente}</td>
                <td>{v.empleado}</td>
                <td>
                  ${Number(v.total_venta).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  {v.fecha_hora}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {ventas.length === 0 && !loading && !error && (
        <p className="text-muted text-center">No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default InformeVentas;