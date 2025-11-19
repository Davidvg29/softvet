import axios from "axios";
import { detallesVentas } from "../../endpoints/endpoints";
import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import Table from 'react-bootstrap/Table';

const VerVenta = ({ venta }) => {

  const [detalle_venta, setDetalle_venta] = useState([]);

  const cargarVenta = async () => {
    try {
      const { data } = await axios.get(`${detallesVentas}/ver`, {withCredentials: true});
      const detalleVentaFiltrado = data.filter((v) => v.id_venta == venta.id_venta);
      setDetalle_venta(detalleVentaFiltrado);
      // console.log(data);
      
    } catch (error) {
      console.error('Error al cargar las ventas:', error);
    }
  };

  useEffect(() => {
    cargarVenta();
  }, []);


  // console.log("VENTA:", venta);
  // console.log("DETALLE VENTA:", detalle_venta);

  return (
    <>
      <Card
      style={{
        margin: "2rem auto",
        padding: "10px",
        width: "100%",
        maxWidth: "100%",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card.Body>
        {/* <Card.Title
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.6rem",
            fontWeight: "bold",
            color: "#2c3e50",
            textAlign: "center",
          }}
        >
          VENTA N°: {venta.id_venta}
        </Card.Title> */}

        <div style={{ lineHeight: "1", fontSize: "1rem", color: "#34495e" }} className="d-flex flex-wrap">
            <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Venta N°: </strong>{venta.id_venta}
            {/* {venta.fecha_hora.slice(0, 10)} */}
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Fecha: </strong>{venta.fecha_hora.slice(0, 10)}
            {/* {venta.fecha_hora.slice(0, 10)} */}
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Hora: </strong>{venta.fecha_hora.slice(11, 16)}
            
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Total: </strong>$ {venta.total}
            
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Cliente: </strong>{venta.nombre_cliente}
            
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>DNI cliente: </strong>{venta.dni_cliente}
            
          </p>
          <p className="mx-2">
            <strong style={{ color: "#6f42c1" }}>Empleado: </strong>{venta.nombre_empleado}
            
          </p>
          
        </div>
      </Card.Body>
      <div
          style={{
            border: "3px solid #6f42c1",
            borderRadius: "16px",
            padding: "25px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "100%",
            marginTop: "0px",
          }}
        >
          <Table
            hover
            responsive
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderSpacing: "0px",
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
                <th style={{ padding: "14px", borderTopLeftRadius: "10px" }}>cod. prod.</th>
                <th style={{ padding: "14px" }}>Producto</th>
                <th style={{ padding: "14px" }}>Prec. act.</th>
                <th style={{ padding: "14px" }}>Cant.</th>
                <th style={{ padding: "14px" }}>Prec. u.</th>
                <th style={{ padding: "14px" }}>Sub total</th>
              </tr>
            </thead>
            



            <tbody >
              {detalle_venta.length > 0 ? (
                detalle_venta.map((detalle) => (
                  <tr
                    key={detalle.id_detalle_venta}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      transform: "translateY(0)",
                      fontSize: "14px",
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
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      {detalle.codigo_producto ?? ''}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      {detalle.nombre_producto ?? ''}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                        $ {detalle.precio_producto_actual}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                        {detalle.cantidad}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                        $ {detalle.precio_unitario}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                        $ {detalle.sub_total}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron Detalles de Ventas.
                  </td>
                </tr>
              )}
            </tbody>


          </Table>
        </div>
    </Card>
    </>
  );
};

export default VerVenta;
