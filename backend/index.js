const express = require ("express")
const morgan = require ("morgan")
const cors = require ("cors");
const cookieParser = require('cookie-parser');
const {connection} = require('./config/bd/dataBase')

//instancio express
const app = express()

//habilito cors
app.use(cors({
  origin: 'http://localhost:5173' // Puerto que utilizo en el frontend
})); 

//utilizo libreria
app.use(express.json())
app.use(morgan('dev'));
app.use(cookieParser())

const prueba = require('./routers/prueba');
const mascotasRouter  = require("./routers/mascotas");
const stockRouter = require("./routers/stock");
const empleados = require('./routers/empleados');
const clientes = require('./routers/clientes');
const historiaClinica = require('./routers/historiaClinica');
const roles = require('./routers/roles');
const turnos = require('./routers/turnos');
const razas = require('./routers/razas');
const especies = require('./routers/especies');
const sucursales = require('./routers/sucursales');
const categorias = require('./routers/categorias');
const detalleHistoriaClinica = require('./routers/detalle_historia_clinica');
const compras = require('./routers/compras');
const productos = require('./routers/productos');
const proveedores = require('./routers/proveedores');
const ventas = require('./routers/ventas');
const detallesVentas = require('./routers/detallesVentas');
const detallesCompras = require('./routers/detallesCompras');
const { verifyToken } = require("./middlewares/jwt");

app.use('/', prueba)
app.use('/mascotas', mascotasRouter);
app.use('/stock',verifyToken, stockRouter);
app.use('/empleados', empleados)
app.use('/clientes',verifyToken, clientes)
app.use('/historiaClinica',verifyToken, historiaClinica)
app.use('/roles',verifyToken, roles)
app.use('/turnos',verifyToken, turnos)
app.use('/razas',verifyToken, razas)
app.use('/especies',verifyToken, especies);
app.use('/sucursales',verifyToken, sucursales);
app.use('/categorias',verifyToken, categorias);
app.use('/detalleHistoriaClinica', detalleHistoriaClinica);
app.use('/compras',verifyToken, compras);
app.use('/productos',verifyToken, productos);
app.use('/proveedores',verifyToken, proveedores);
app.use('/ventas',verifyToken, ventas);
app.use('/detallesVentas',verifyToken, detallesVentas);
app.use('/detallesCompras',verifyToken, detallesCompras);

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})