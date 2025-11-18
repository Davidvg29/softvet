import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import { useClientesStore } from "../../zustand/cliente";
import { useProductosStore } from '../../zustand/productos';

const CrearVenta = ({ onClose, onUpdate }) => {
  const { clientes } = useClientesStore();
  const { productos } = useProductosStore();

  const [formData, setFormData] = useState({
    id_cliente: "",
    id_producto: "",
    cantidad: 1,
  });

  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ➕ AÑADIR ITEM
  const handleAddItem = () => {
    if (!formData.id_producto || !formData.cantidad) return;

    const prod = productos.find(
      (p) => p.id_producto === parseInt(formData.id_producto)
    );

    const nuevo = {
      id_producto: prod.id_producto,
      nombre_producto: prod.nombre_producto,
      precio: parseFloat(prod.precio_producto),
      cantidad: parseInt(formData.cantidad),
      subtotal:
        parseFloat(prod.precio_producto) * parseInt(formData.cantidad),
    };

    setItems([...items, nuevo]);

    // 🔹 Limpiar inputs después de añadir
    setFormData({
      ...formData,
      id_producto: "",
      cantidad: 1,
    });
  };

  // ❌ ELIMINAR ITEM
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // 🔄 ACTUALIZAR CANTIDAD DESDE LA TABLA
  const handleUpdateCantidad = (index, nuevaCantidad) => {
    const updated = [...items];
    updated[index].cantidad = parseInt(nuevaCantidad);
    updated[index].subtotal =
      updated[index].precio * updated[index].cantidad;

    setItems(updated);
  };

  // Total general
  const totalGeneral = items.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("VENTA FINAL:", {
      cliente: formData.id_cliente,
      items,
      totalGeneral
    });
  };

  return (
    <div style={{ backgroundColor: "#cfcfcf", borderRadius: "10px", padding: "25px 40px", color: "#000" }}>
      <Form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 20px", textAlign: "left" }}>

          {/* CLIENTE */}
          <Form.Group>
            <Form.Label><strong>Cliente:</strong></Form.Label>
            <Form.Select
              name="id_cliente"
              value={formData.id_cliente}
              onChange={handleChange}
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
              value={formData.id_producto}
              onChange={handleChange}
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
              value={formData.cantidad}
              min="1"
              onChange={handleChange}
              style={{ borderRadius: "8px", width: "80px" }}
            />
          </Form.Group>

          {/* BOTÓN AÑADIR */}
          <Button
            type="button"
            onClick={handleAddItem}
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
        {items.length > 0 && (
          <div style={{ marginTop: "25px" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.nombre_producto}</td>
                    <td>${item.precio}</td>

                    {/* CAMBIAR CANTIDAD */}
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleUpdateCantidad(idx, e.target.value)
                        }
                        style={{ width: "80px" }}
                      />
                    </td>

                    <td>${item.subtotal}</td>

                    {/* ELIMINAR */}
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteItem(idx)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h4 style={{ textAlign: "right", marginRight: "10px" }}>
              <strong>Total:</strong> ${totalGeneral}
            </h4>
          </div>
        )}

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
