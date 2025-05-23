const app = require('./app');
const db = require('./db');
const { IP_SERVER, API_VERSION } = require('./constants');
require('dotenv').config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("API REST de la app funcionando");
  console.log("-------------------------------");
  console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
});


process.on('SIGINT', async () => {
  console.log("Cerrando la conexión a la base de datos y terminando la aplicación...");
  try {
    await db.end();
    console.log("Conexión a la base de datos cerrada.");
  } catch (err) {
    console.error("Error al cerrar la conexión a la base de datos", err);
  }
  process.exit();
});
