const mysql = require('mysql');
require('dotenv').config(); // Cargar las variables de entorno desde .env

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        // Necesario para conexiones SSL a DigitalOcean MySQL
        rejectUnauthorized: true
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos, está el servidor arrancado?:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

module.exports = db;
