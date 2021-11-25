const db = require('../configuration/dbConn');

exports.admin_signin = async (username) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT id, username, password FROM tbl_admin WHERE username = ?';
        let value = [username];
        db.query(query, value, (err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.add_admin_signin_log = async (log) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_admin_login_log SET ?';
        let value = [log];
        db.query(query, value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.admin_details = async (id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT id, username, name FROM tbl_admin WHERE id = ?';
        let value = [id];
        db.query(query, value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};
