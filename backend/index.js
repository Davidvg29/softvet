const express = require ("express")
const morgan = require ("morgan")
const cors = require ("cors");
const {connection} = require('./config//bd/dataBase')

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
const roles = require('./routers/roles')

app.use('/prueba', prueba)
app.use('/roles', roles)

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})