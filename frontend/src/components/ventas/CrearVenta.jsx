import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import { useClientesStore } from "../../zustand/cliente";
import { useProductosStore } from '../../zustand/productos';
import { useEmpleadoStore } from '../../zustand/empleado';
import { detallesVentas, VENTAS } from '../../endpoints/endpoints';
import axios from 'axios';
import Swal from 'sweetalert2';

const CrearVenta = ({ onClose, onUpdate, cargarVentas }) => {
  const { clientes } = useClientesStore();
  const { productos } = useProductosStore();
  const { empleado } = useEmpleadoStore();
  const [productoSeleccionado, setProductoSeleccionado] = useState({})
  const [idVentaRecienCreada, setIdVentaRecienCreada] = useState(null)
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarListaProducto, setMostrarListaProducto] = useState(false);
  const [mostrarListaCliente, setMostrarListaCliente] = useState(false);

  const [detalleVenta, setDetalleVenta] = useState({
    cantidad: "",
    precio_unitario: productoSeleccionado.precio_producto,
    sub_total: "",
    id_venta: "",
    id_producto: ""
  });

  const [venta, setVenta] = useState({
    total: "",
    id_cliente: "",
    id_empleado: String(empleado.id_empleado)
  });

  const [items, setItems] = useState([]);

  const handleVenta = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleDetalleVenta = (e) => {
    const { name, value } = e.target;

    const cantidad = name === "cantidad" ? value : detalleVenta.cantidad;
    const precio = name === "precio_unitario" ? value : detalleVenta.precio_unitario;

    setDetalleVenta({
      ...detalleVenta,
      [name]: value,
      sub_total: (cantidad && precio) ? cantidad * precio : ""
    });
  };


  const handleProductoSeleccionado = (producto) => {
    setProductoSeleccionado(producto);

    setDetalleVenta(prev => {
      const precio = producto?.precio_producto || 0;
      const cantidad = prev.cantidad;
      return {
        ...prev,
        precio_unitario: precio,
        sub_total: cantidad ? cantidad * precio : "",
      };
    });
  };

  const agregarItem = () => {
    if (!detalleVenta.id_producto || !detalleVenta.cantidad) return;

    const producto = productos.find(
      (p) => p.id_producto === Number(detalleVenta.id_producto)
    );

    const precio = producto?.precio_producto || 0;
    const subTotal = precio * detalleVenta.cantidad;

    const nuevoItem = {
      ...detalleVenta,
      nombre_producto: producto.nombre_producto,
      codigo_producto: producto.codigo_producto,
      precio_unitario: precio,
      sub_total: subTotal
    };


    setItems([...items, nuevoItem]);

    setVenta(prev => ({
      ...prev,
      total: Number(prev.total || 0) + subTotal
    }));

    // limpiar
    setDetalleVenta({
      cantidad: "",
      precio_unitario: "",
      sub_total: "",
      id_producto: ""
    });
  };

  const sendData = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${VENTAS}/crear`, venta, { withCredentials: true })
      // console.log("venta creada: ", data);

      const itemsConVenta = items.map(item => ({ ...item, id_venta: data.id_venta }));

      for (let item of itemsConVenta) {
        await axios.post(`${detallesVentas}/crear`, item, { withCredentials: true });
      }

      onClose()
      await Swal.fire({
        icon: 'success',
        title: 'Venta creada con éxito!',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6f42c1',
      });
      cargarVentas()
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.error,
        confirmButtonText: "Aceptar",
      });

    }
  }

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    cliente.dni_cliente?.toString().includes(busquedaCliente)
  );

  const productosFiltrados = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    producto.codigo_producto?.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
      <Form onSubmit={sendData}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 20px", textAlign: "left" }}>

          {/* CLIENTE */}
          <Form.Group style={{ position: "relative" }}>
            <Form.Label><strong>Cliente:</strong></Form.Label>

            <Form.Control
              type="text"
              placeholder="Buscar Cliente por nombre o DNI..."
              value={busquedaCliente}
              onChange={(e) => {
                setBusquedaCliente(e.target.value);
                setMostrarListaCliente(true);
              }}
              onFocus={() => setMostrarListaC(true)}
              autoComplete="off"
            />

            {mostrarListaCliente && busquedaCliente && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: "4px"
                }}
              >
                {clientes
                  .filter(cliente =>
                    cliente.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
                    cliente.dni_cliente?.toString().includes(busquedaCliente)
                  )
                  .map(cliente => (
                    <div
                      key={cliente.id_cliente}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1"
                      }}
                      onClick={() => {
                        setBusquedaCliente(
                          `${cliente.nombre_cliente} - DNI: ${cliente.dni_cliente}`
                        );

                        setVenta(prev => ({
                          ...prev,
                          id_cliente: cliente.id_cliente
                        }));

                        setMostrarListaCliente(false);
                      }}
                    >
                      {cliente.nombre_cliente} - DNI: {cliente.dni_cliente}
                    </div>
                  ))}
              </div>
            )}
          </Form.Group>

          {/* PRODUCTO */}
          <Form.Group style={{ position: "relative" }}>
            <Form.Label><strong>Producto:</strong></Form.Label>

            <Form.Control
              type="text"
              placeholder="Buscar producto por nombre o código..."
              value={busquedaProducto}
              onChange={(e) => {
                setBusquedaProducto(e.target.value);
                setMostrarListaProducto(true);
              }}
              onFocus={() => setMostrarListaProducto(true)}
              autoComplete="off"
            />

            {mostrarListaProducto && busquedaProducto && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: "4px"
                }}
              >
                {productos
                  .filter(producto =>
                    producto.nombre_producto.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
                    producto.codigo_producto.toLowerCase().includes(busquedaProducto.toLowerCase())
                  )
                  .map(producto => (
                    <div
                      key={producto.id_producto}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1"
                      }}
                      onClick={() => {
                        setBusquedaProducto(
                          `${producto.nombre_producto} - Cod: ${producto.codigo_producto}`
                        );

                        setDetalleVenta(prev => ({
                          ...prev,
                          id_producto: producto.id_producto,
                          precio_unitario: producto.precio_producto,
                          sub_total: prev.cantidad
                            ? prev.cantidad * producto.precio_producto
                            : ""
                        }));

                        setMostrarListaProducto(false);
                      }}
                    >
                      {producto.nombre_producto} - Cod: {producto.codigo_producto}
                    </div>
                  ))}
              </div>
            )}
          </Form.Group>

          {/* CANTIDAD */}
          <Form.Group>
            <Form.Label><strong>Cantidad:</strong></Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={detalleVenta.cantidad}
              min="1"
              onChange={handleDetalleVenta}
              style={{ borderRadius: "8px", width: "80px" }}
            />
          </Form.Group>



          {/* BOTÓN AÑADIR */}
          <Button
            type="button"
            onClick={agregarItem}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#4ec04eff",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #3cb364ff",
              fontSize: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            +
          </Button>
        </div>

        {/* TABLA DE ITEMS */}
        <div className='mt-3'>
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
                {/* <th style={{ padding: "14px" }}>Prec. act.</th> */}
                <th style={{ padding: "14px" }}>Cant.</th>
                <th style={{ padding: "14px" }}>Prec. u.</th>
                <th style={{ padding: "14px" }}>Sub total</th>
              </tr>
            </thead>
            <tbody >
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={index}
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
                      {item.codigo_producto}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      {item.nombre_producto}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      {item.cantidad}
                    </td>
                    {/* <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                        {"Asd"}
                    </td> */}
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      $ {item.precio_unitario}
                    </td>
                    <td style={{ padding: "3px", fontWeight: "400", textAlign: "center", color: "#333", border: "none" }}>
                      $ {item.sub_total}
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
        <div><p>Total: ${venta.total || 0}</p></div>


        {/* BOTONES */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Button
            type="submit"
            style={{
              backgroundColor: "#5a7edc",
              border: "none",
              borderRadius: "20px",
              padding: "10px 28px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #3c5bb3",
            }}
          >
            Guardar
          </Button>

          <Button
            onClick={onClose}
            style={{
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: "20px",
              padding: "10px 28px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 0 #b33a2b",
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CrearVenta;
