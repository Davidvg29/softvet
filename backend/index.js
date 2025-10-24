const express = require ("express")
const morgan = require ("morgan")
const cors = require ("cors");
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

app.use('/', prueba)
app.use('/mascotas', mascotasRouter);
app.use('/stock', stockRouter);
app.use('/empleados', empleados)
app.use('/clientes', clientes)
app.use('/historiaClinica', historiaClinica)
app.use('/roles', roles)
app.use('/turnos', turnos)
app.use('/razas', razas)
app.use('/especies', especies);
app.use('/sucursales', sucursales);
app.use('/categorias', categorias);
app.use('/detalleHistoriaClinica', detalleHistoriaClinica);
app.use('/compras', compras);
app.use('/productos', productos);
app.use('/proveedores', proveedores);
app.use('/ventas', ventas);
app.use('/detallesVentas', detallesVentas);

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})