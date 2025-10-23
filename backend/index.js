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

const prueba = require('./routers/prueba');
const mascotasRouter  = require("./routers/mascotas");
const stockRouter = require("./routers/stock");

app.use('/', prueba)
app.use('/mascotas', mascotasRouter);
app.use('/stock', stockRouter);

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})