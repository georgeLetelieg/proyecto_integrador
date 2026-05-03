/*
//-----------------------------------
//Llamaremos a expres de la siguente forma/(Recordar que estamos usando un frasmewok)
const express = require('express');
//LLamamos un metodo de express, el cual es app, este nos va a servir para cuando se hagan peticiones GET a la ruta raiz
const app = express();
//LLamamos al metodo PORT y le asignamos un numero de puerto
const PORT = 3000;


// Para leer JSON en las peticiones
app.use(express.json());

//Ahora cuando se solicite una peticion a la ruta raiz que es '/'
// pasaremos dos argumentos que son request (una peticion) y response (la respuesta)
app.get('/', (req, res) => {
  res.send('¡Servidor funcionandosss!');
});


//Lamamos al metodo app con su extencion "Escucha", acá estamos agregando el puerto definidfo arriba
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//-----------------------------------
*/


//-----------------------------------
/*
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
//-----------------------------------


require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Llammos a las rutas
const authRoutes = require('./routes/auth.routes');
const huertoRoutes = require('./routes/huertos.routes');

app.use(express.json());

// estaremos llamando a: /auth/registro y /auth/login, por eso solo invocamos al '/auth'
app.use('/auth', authRoutes);
app.use('/huertos', huertoRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});