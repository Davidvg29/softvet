import { useState, useEffect } from "react";
import { productos, categorias } from "../../endpoints/endpoints";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const VerProducto = ({ id_producto }) => {
    const [producto, setProducto] = useState(null);
    const [categoria, setCategorias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${categorias}/ver`, { withCredentials: true });
                const categoriaData = response.data.map((c) => ({
                    ...c,
                    id_categoria: Number(c.id_categoria),
                }));
                setCategorias(categoriaData);
            } catch (error) {
                console.error("Error al cargar las Categorias:", error);
                setError("Error al cargar las Categorias.");
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (!id_producto) return;

        const getProducto = async () => {
            try {
                const response = await axios.get(`${productos}/ver/${id_producto}`, {
                    withCredentials: true,
                });

                setProducto(response.data);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
                setError("Error al obtener el producto.");
            }
        };

        getProducto();
    }, [id_producto]);

    if (error)
        return (
            <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
                {error}
            </p>
        );

    if (!producto || producto.length === 0)
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <Spinner animation="border" variant="primary" />
                <p style={{ marginTop: "10px", color: "#555" }}>Cargando Cliente...</p>
            </div>
        );

    const categoriaProducto = categoria.find(
        (c) => c.id_categoria === Number(producto.id_categoria)
    );

    return (
        <Card
            style={{
                margin: "2rem auto",
                padding: "2rem",
                width: "80%",
                maxWidth: "600px",
                borderRadius: "20px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f8f9fa",
            }}
        >
            <Card.Body>
                <Card.Title
                    style={{
                        marginBottom: "1.5rem",
                        fontSize: "1.6rem",
                        fontWeight: "bold",
                        color: "#2c3e50",
                        textAlign: "center",
                    }}
                >
                    PRODUCTO: {producto.nombre_producto}
                </Card.Title>

                <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#34495e" }}>
                    <p>
                        <strong style={{ color: "#6f42c1" }}>Código:</strong>{" "}
                        {producto.codigo_producto}
                    </p>
                    <p>
                        <strong style={{ color: "#6f42c1" }}>Precio:</strong>{" "}
                        {producto.precio_producto}
                    </p>
                    <p>
                        <strong style={{ color: "#6f42c1" }}>Categoría:</strong>{" "}
                        {categoriaProducto ? categoriaProducto.nombre_categoria : "Sin categoría"}
                    </p>

                </div>
            </Card.Body>
        </Card>
    );
};

export default VerProducto;