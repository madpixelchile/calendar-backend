
//Importaciones node son así
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { dbConnection } = require('./database/config');

// console.log(process.env);

//Crear servidor de express
const app = express();

//Directorio público 
app.use( express.static('public') );

//Base de datos
dbConnection();

// CORS
// const corsOptions = {
//     origin: 'https://mi-sitio-frontend.com',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// };
app.use(cors()); //corsOptions

//Lectura y parseo del body
app.use( express.json() );

//Rutas AUTH endpoints
app.use('/api/auth', require('./routes/auth'));

//Rutas EVENTOS endpoints
app.use('/api/events', require('./routes/events'));

//IMPORTANTE PARA NO TENER PROBLEMAS CON LAS RUTAS DEL FRONT END EN PRODUCCIÓN.
app.get('*',(req,res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

//crear usuarios, login, renew
//CRUD: Eventos del calendario

//Escuchar peticiones .Numero del puerto + un callback
app.listen( process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
})

