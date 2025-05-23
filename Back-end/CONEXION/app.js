const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { API_VERSION } = require('./constants');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Middleware para manejar errores de JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error de sintaxis en el JSON:', err.message);
    return res.status(400).json({ error: 'El cuerpo de la solicitud contiene un JSON inválido.' });
  }
  next();
});

const routes = [
  'Usuario',
  'Doctor',
  'Paciente',
  'Consulta',
  'Chat',

  
];


routes.forEach(route => {
  const routeModule = require(`../ACCION/routes/${route}.route`);
  app.use(`/api/${API_VERSION}/${route}`, routeModule);
});

module.exports = app;