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
    setBusquedaProducto("")
  };

  const sendData = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${VENTAS}/crear`, venta, { withCredentials: true });

    const itemsConVenta = items.map(item => ({
      ...item,
      id_venta: data.id_venta
    }));

    for (let item of itemsConVenta) {
      await axios.post(`${detallesVentas}/crear`, item, { withCredentials: true });
    }

    if (onUpdate) {
      onUpdate(data.id_venta);   
    }

    onClose();

    await Swal.fire({
      icon: 'success',
      title: 'Venta creada con éxito!',
      confirmButtonColor: '#6f42c1',
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.error,
    });
  }
};

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    cliente.dni_cliente?.toString().includes(busquedaCliente)
  );

  const productosFiltrados = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    producto.codigo_producto?.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const eliminarItem = (indexEliminar) => {
    // 1. Buscamos el item que vamos a eliminar para saber cuánto restar al total
    const itemAEliminar = items[indexEliminar];

    // 2. Filtramos la lista para quitar el item por su índice
    const nuevosItems = items.filter((_, index) => index !== indexEliminar);
    setItems(nuevosItems);

    // 3. Actualizamos el total de la venta restando el sub_total del producto eliminado
    setVenta(prev => ({
      ...prev,
      total: Number(prev.total) - Number(itemAEliminar.sub_total)
    }));
  };

  return (
    <div style={{ borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
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
              // onFocus={() => setMostrarListaC(true)}
              autoComplete="off"
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
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

         {/* CANTIDAD + BOTÓN */}
<div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
  
  <Form.Group>
    <Form.Label><strong>Cantidad:</strong></Form.Label>
    <Form.Control
      type="number"
      name="cantidad"
      value={detalleVenta.cantidad}
      min="1"
      onChange={handleDetalleVenta}
      style={{ borderRadius: "8px", width: "80px" }}
      onFocus={(e) => {
        e.target.style.border = "1px solid #6f42c1";
        e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid #ced4da";
        e.target.style.boxShadow = "none";
      }}
    />
  </Form.Group>

  <Button
    type="button"
    onClick={agregarItem}
    style={{
      height: "38px",
      padding: "0 15px",
      backgroundColor: "#4ec04eff",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      color: "#fff",
      boxShadow: "0 4px 0 #3cb364ff",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      marginBottom: "2px"
    }}
  >
    + Agregar
  </Button>

</div>
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
                <th style={{ padding: "14px" }}></th>
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
                      <td>
                        <Button
                        size="sm"
                        variant="danger"
                        onClick={() => eliminarItem(index)}
                      >
                        X
                      </Button>
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
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <Button
            type="submit"
            style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(111,66,193,0.4)",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
            }}
          >
            Guardar
          </Button>

          <Button
            onClick={onClose}
            style={{
              padding: "12px 30px",
              borderRadius: "14px",
              border: "none",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(111,66,193,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(111,66,193,0.4)";
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
