const mysql = require('mysql');
require('dotenv').config(); // Cargar las variables de entorno desde .env

const db = mysql.createConnection({
    host: process.env.AZURE_MYSQL_HOST,
    user: process.env.AZURE_MYSQL_USER,
    password: process.env.AZURE_MYSQL_PASSWORD,
    database: 'plazzy',
    port: process.env.AZURE_MYSQL_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos, está el servidor arrancado?:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

module.exports = db;
