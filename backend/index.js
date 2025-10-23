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

const prueba = require('./controllers/prueba');
const empleados = require('./routers/empleados');
const clientes = require('./routers/clientes');
const roles = require('./routers/roles');
const turnos = require('./routers/turnos');
const especies = require('./routers/especies');

app.use('/prueba', prueba)
app.use('/empleados', empleados)
app.use('/clientes', clientes)
app.use('/roles', roles)
app.use('/turnos', turnos)
app.use('/especies', especies);

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})