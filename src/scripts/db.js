const mysql = require('mysql');

const db = mysql.createConnection({
    host: '192.168.18.33',
    user: 'root',
    password: 'root',
    database: 'plazzy'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

module.exports = db;
