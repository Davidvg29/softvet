import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import { useClientesStore } from "../../zustand/cliente";
import { useProductosStore } from "../../zustand/productos";
import { useEmpleadoStore } from "../../zustand/empleado";
import { VENTAS, detallesVentas } from "../../endpoints/endpoints";
import Swal from "sweetalert2";
import axios from "axios";

const EditVenta = ({ id_venta, onClose, onUpdate }) => {

  const { clientes } = useClientesStore();
  const { productos } = useProductosStore();
  const { empleado } = useEmpleadoStore();

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [mostrarListaCliente, setMostrarListaCliente] = useState(false);

  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarListaProducto, setMostrarListaProducto] = useState(false);

  const [venta, setVenta] = useState({
    total: 0,
    id_cliente: "",
    id_empleado: ""
  });

  const [items, setItems] = useState([]);
  const [itemsABorrar, setItemsABorrar] = useState([]);

  const [detalleVenta, setDetalleVenta] = useState({
    cantidad: "",
    precio_unitario: "",
    sub_total: "",
    id_producto: ""
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState({});

  // --- Función central: recalcular total en base al array ---
  const calcularTotal = (itemsArray) =>
    itemsArray.reduce((acc, item) => acc + Number(item.sub_total || 0), 0);


  // CARGAR VENTA + DETALLES
  const cargarVenta = async () => {
    try {
      const { data: ventas } = await axios.get(`${VENTAS}/ver`, { withCredentials: true });
      const v = ventas.find(v => Number(v.id_venta) === Number(id_venta));

      if (!v) {
        setVenta({});
        setItems([]);
        return;
      }

      setVenta({
        total: Number(v.total),
        id_cliente: String(v.id_cliente),
        id_empleado: String(v.id_empleado)
      });

      const clienteActual = clientes.find(c => c.id_cliente === v.id_cliente);

if (clienteActual) {
  setBusquedaCliente(`${clienteActual.nombre_cliente} - DNI: ${clienteActual.dni_cliente}`);
}

      const { data: detallesAll } = await axios.get(`${detallesVentas}/ver`, { withCredentials: true });

      const detallesFiltrados = detallesAll.filter(d => Number(d.id_venta) === Number(id_venta));

      setItems(detallesFiltrados);

      // total correcto aquí
      setVenta(prev => ({
        ...prev,
        total: calcularTotal(detallesFiltrados)
      }));

    } catch (err) {
      console.error("Error cargando venta:", err);
      setVenta({});
      setItems([]);
    }
  };

  useEffect(() => {
    cargarVenta();
  }, []);

  // -------------------
  // MANEJAR CAMBIOS
  // -------------------
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
      sub_total: cantidad && precio ? cantidad * precio : ""
    });
  };

  const handleProductoSeleccionado = (producto) => {
    setProductoSeleccionado(producto);

    setDetalleVenta(prev => ({
      ...prev,
      precio_unitario: producto.precio_producto,
      sub_total: prev.cantidad ? prev.cantidad * producto.precio_producto : ""
    }));
  };

  // -------------------
  // AGREGAR ITEM NUEVO
  // -------------------
  const agregarItem = () => {
    if (!detalleVenta.id_producto || !detalleVenta.cantidad) return;

    const producto = productos.find(
      (p) => p.id_producto === Number(detalleVenta.id_producto)
    );

    const precio = producto.precio_producto;
    const subTotal = precio * detalleVenta.cantidad;

    const nuevoItem = {
      ...detalleVenta,
      nombre_producto: producto.nombre_producto,
      codigo_producto: producto.codigo_producto,
      precio_unitario: precio,
      sub_total: subTotal,
      id_venta,
      nuevo: true
    };

    const newItems = [...items, nuevoItem];

    setItems(newItems);

    // TOTAL CORRECTO
    setVenta(prev => ({
      ...prev,
      total: calcularTotal(newItems)
    }));

    setDetalleVenta({
      cantidad: "",
      precio_unitario: "",
      sub_total: "",
      id_producto: ""
    });
  };

  // -------------------
  // ELIMINAR ITEM
  // -------------------
  const eliminarItem = (index) => {
    const item = items[index];
    setItemsABorrar(prev => [...prev, item]);

    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    // TOTAL CORRECTO
    setVenta(prev => ({
      ...prev,
      total: calcularTotal(newItems)
    }));
  };

  // -------------------
  // EDITAR CANTIDAD
  // -------------------
  const editarCantidadItem = (index, nuevaCantidad) => {
    const updated = [...items];
    const item = updated[index];

    updated[index] = {
      ...item,
      cantidad: nuevaCantidad,
      sub_total: item.precio_unitario * nuevaCantidad
    };

    setItems(updated);

    // TOTAL CORRECTO
    setVenta(prev => ({
      ...prev,
      total: calcularTotal(updated)
    }));
  };

  // -------------------
  // GUARDAR CAMBIOS
  // -------------------
  const guardarCambios = async (e) => {
    e.preventDefault();

    try {
      for (let item of items) {
        if (!item.nuevo) {
          await axios.put(`${detallesVentas}/editar/${item.id_detalle_venta}`, {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            sub_total: item.sub_total,
            id_venta: item.id_venta,
            id_producto: item.id_producto
          }, { withCredentials: true });
        }
      }

      for (let itemABorrar of itemsABorrar) {
        if (itemABorrar.id_detalle_venta) {
          await axios.delete(`${detallesVentas}/borrar/${itemABorrar.id_detalle_venta}`, {
            withCredentials: true
          });
        }
      }

      for (let item of items) {
        if (item.nuevo) {
          await axios.post(`${detallesVentas}/crear`, {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            sub_total: item.sub_total,
            id_venta,
            id_producto: item.id_producto
          }, { withCredentials: true });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Venta actualizada correctamente",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#6f42c1"
      });

      onClose();
      onUpdate();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la venta."
      });
    }
  };

  // -------------------
  // RENDER
  // -------------------
  return (
    <div style={{ borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
      <Form onSubmit={guardarCambios}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 20px", textAlign: "left" }}>

          {/* CLIENTE */}
          <Form.Group style={{ position: "relative" }}>
            <Form.Label><strong>Cliente:</strong></Form.Label>

            <Form.Control
              type="text"
              placeholder="Buscar cliente por nombre o DNI..."
              value={busquedaCliente}
              onChange={(e) => {
                setBusquedaCliente(e.target.value);
                setMostrarListaCliente(true);
              }}
              onFocus={() => setMostrarListaCliente(true)}
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

          {/* CANTIDAD */}
          <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
          <Form.Group>
            <Form.Label><strong>Cantidad:</strong></Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="cantidad"
              value={detalleVenta.cantidad}
              onChange={handleDetalleVenta}
              style={{ width: "80px", borderRadius: "8px" }}
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

          {/* BOTÓN AÑADIR */}
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
        <div className="mt-3">
          <Table hover responsive>
            <thead>
              <tr style={{
                background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
                color: "#fff", textAlign: "center"
              }}>
                <th>cod. prod.</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Prec. u.</th>
                <th>Sub total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: "#fff" }}>

                    <td>{item.codigo_producto}</td>
                    <td>{item.nombre_producto}</td>

                    {/* EDITAR CANTIDAD */}
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => editarCantidadItem(index, Number(e.target.value))}
                        style={{ width: "70px" }}
                      />
                    </td>

                    <td>$ {item.precio_unitario}</td>
                    <td>$ {item.sub_total}</td>

                    {/* ELIMINAR */}
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
                  <td colSpan="6" className="text-center py-3">
                    No hay ítems cargados.
                  </td>
                </tr>
              )}
            </tbody>

          </Table>
        </div>

        <div><p><strong>Total: ${venta.total || 0}</strong></p></div>

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
            Guardar Cambios
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

export default EditVenta;
