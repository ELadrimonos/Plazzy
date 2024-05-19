const mysql = require('mysql');
require('dotenv').config(); // Cargar las variables de entorno desde .env

const db = mysql.createConnection({
    host: process.env.BBDD_IP,
    user: process.env.BBDD_USER,
    password: process.env.BBDD_PSWD,
    database: 'plazzy',
    port: process.env.BBDD_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos, está el servidor arrancado?:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

module.exports = db;
