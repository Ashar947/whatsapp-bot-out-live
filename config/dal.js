const mysql = require('mysql2');

class DAL_ {

    constructor(config) {
        this.connection = mysql.connect(config);
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connect.connect((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    GetData(SP_Name, Params) {
        return new Promise((resolve, reject) => {
            this.connection.query(`CALL ${SP_Name}(${Params.map(() => '?').join(',')})`, Params, (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
    InsertData(SP_Name, Params) {
        let isSuccess = false;
        return new Promise((resolve, reject) => {
            this.connection.query(`CALL ${SP_Name}(${Params.map(() => '?').join(',')})`, Params, (err, results) => {
                if (err) reject(err);

                if (results.affectedRows > 0) {
                    isSuccess = true;
                    resolve(isSuccess);
                }
            });
        });
    }
}

module.exports = DAL_;