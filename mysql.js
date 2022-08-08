require('dotenv').config()
var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Mysql Connected!");
});

const logger = function (id_clinet,queue, vaule) {
    let date_ob = new Date();
    var sql = `INSERT INTO penampung_TB SET id_clinet= ?, queue= ?,vaule= ?, created_at= ?`;
    con.query(sql, [id_clinet,queue, vaule, date_ob], function (err, result) {
        if (err) throw err;
        console.log("logger records inserted: " + result.affectedRows);
    });
    return;
};
const verify = function (id_clinet, queue, berhasil, gagal) {
    let date_ob = new Date();
    var sql = `INSERT INTO valid_DB SET id_clinet= ?,queue= ?, berhasil= ?, gagal= ?, created_at= ?`;
    con.query(sql, [id_clinet,queue, berhasil, gagal, date_ob], function (err, result) {
        if (err) throw err;
        console.log("verify records inserted: " + result.affectedRows);
    });
    return;
}
module.exports = {
    logger,
    verify
}