import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import { useClientesStore } from "../../zustand/cliente";
import { useProductosStore } from '../../zustand/productos';
import { useEmpleadoStore } from '../../zustand/empleado';

const CrearVenta = ({ onClose, onUpdate }) => {
  const { clientes } = useClientesStore();
  const { productos } = useProductosStore();
  const { empleado } = useEmpleadoStore();

  const [detalleVenta, setDetalleVenta] = useState({
    cantidad: "",
    precio_unitario: "",
    sub_total: "",
    id_producto: ""
  });

  const [venta, setVenta] = useState({
    total: "",
    id_cliente: "",
    id_empleado: empleado.id_empleado
  });

  const [items, setItems] = useState([]);

  const handleVenta = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleDetalleVenta = (e) => {
    setDetalleVenta({ ...detalleVenta, [e.target.name]: e.target.value });
  };

  const handleCantidad = (e) => {
    setDetalleVenta({ ...detalleVenta, cantidad: e.target.value });
  };

  const agregarItem = () => {
    if (!detalleVenta.id_producto || !detalleVenta.cantidad) return;

    const productoSeleccionado = productos.find(
      (p) => p.id_producto === Number(detalleVenta.id_producto)
    );

    const precio = productoSeleccionado?.precio || 0;

    const nuevoItem = {
      ...detalleVenta,
      precio_unitario: precio,
      sub_total: precio * detalleVenta.cantidad
    };

    setItems([...items, nuevoItem]);

    // limpiar
    setDetalleVenta({
      cantidad: "",
      precio_unitario: "",
      sub_total: "",
      id_producto: ""
    });
  };

console.log(venta);
console.log(detalleVenta);



  return (
    <div style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
      <Form onSubmit={""}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 20px", textAlign: "left" }}>

          {/* CLIENTE */}
          <Form.Group>
            <Form.Label><strong>Cliente:</strong></Form.Label>
            <Form.Select
              name="id_cliente"
              value={venta.id_cliente}
              onChange={handleVenta}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* PRODUCTO */}
          <Form.Group>
            <Form.Label><strong>Producto:</strong></Form.Label>
            <Form.Select
              name="id_producto"
              value={detalleVenta.id_producto}
              onChange={handleDetalleVenta}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id_producto} value={producto.id_producto}>
                  {producto.nombre_producto}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* CANTIDAD */}
          <Form.Group>
            <Form.Label><strong>Cantidad:</strong></Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={detalleVenta.cantidad}
              min="1"
              onChange={handleChange}
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
