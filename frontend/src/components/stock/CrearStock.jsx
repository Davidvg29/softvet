import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { STOCK, productos } from "../../endpoints/endpoints";
import { useEmpleadoStore } from "../../zustand/empleado";

const CrearStock = ({ onClose, onUpdate }) => {
  const {empleado} = useEmpleadoStore()
  const initialState = {
    id_producto: "",
    cantidad: "",
    observaciones_stock: "",
    id_sucursal: 1,
  };

  const [formData, setFormData] = useState(initialState);
  const [listaProductos, setListaProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Traer productos para el select
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get(`${productos}/ver`, {
          withCredentials: true,
        });

        const productosSinStock = data.filter(p =>
          p.cantidad === 0 || p.cantidad == null
        );

        setListaProductos(productosSinStock);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los productos para el stock.",
          confirmButtonColor: "#6f42c1",
        });
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.id_producto) {
      return Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debe seleccionar un producto.",
        confirmButtonColor: "#6f42c1",
      });
    }

    if (!formData.cantidad || isNaN(formData.cantidad) || Number(formData.cantidad) <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "La cantidad debe ser un número mayor a 0.",
        confirmButtonColor: "#6f42c1",
      });
    }

    try {
      const payload = {
        cantidad: Number(formData.cantidad),
        observaciones_stock: formData.observaciones_stock || null,
        id_producto: Number(formData.id_producto),
        id_sucursal: Number(formData.id_sucursal),
        id_empleado: empleado?.id_empleado,
      };

      const response = await axios.post(`${STOCK}/crear`, payload, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Stock creado correctamente",
          text: "El stock del producto se registró con éxito.",
          confirmButtonColor: "#6f42c1",
        });

        setFormData(initialState);
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error al crear el stock:", error);

      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo crear el stock. Inténtalo nuevamente.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "#6f42c1",
      });
    }
  };

  return (
    <div
      style={{
        borderRadius: "10px",
        padding: "25px 40px",
        color: "#000",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px 20px",
            textAlign: "left",
          }}
        >
          {/* Producto */}
          <Form.Group>
            <Form.Label>
              <strong>Producto:</strong>
            </Form.Label>
            <Form.Select
              name="id_producto"
              value={formData.id_producto}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
              disabled={loadingProductos}
            >
              <option value="">
                {loadingProductos ? "Cargando productos..." : "Seleccionar producto"}
              </option>
              {listaProductos.map((prod) => (
                <option key={prod.id_producto} value={prod.id_producto}>
                  {prod.nombre_producto} {prod.codigo_producto ? `- (${prod.codigo_producto})` : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Cantidad */}
          <Form.Group>
            <Form.Label>
              <strong>Cantidad:</strong>
            </Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Cantidad de stock"
              style={{ borderRadius: "8px" }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #6f42c1";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(111,66,193,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ced4da";
                e.target.style.boxShadow = "none";
              }}
              min="1"
            />
          </Form.Group>

          {/* Observaciones */}
          <Form.Group style={{ gridColumn: "1 / span 2" }}>
            <Form.Label>
              <strong>Observaciones:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones_stock"
              value={formData.observaciones_stock}
              onChange={handleChange}
              placeholder="Notas sobre este ingreso de stock (opcional)"
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
          </Form.Group>

          {/* SUCURSAL*/}
          {/* <Form.Group>
            <Form.Label><strong>Sucursal:</strong></Form.Label>
            <Form.Select
              name="id_sucursal"
              value={formData.id_sucursal}
              onChange={handleChange}
              style={{ borderRadius: "8px" }}
            >
              <option value="1">Sucursal Central</option>
            </Form.Select>
          </Form.Group> */}
        </div>

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
            type="button"
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

export default CrearStock;