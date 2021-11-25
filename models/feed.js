const db = require('../configuration/dbConn');

exports.get_postal_code = async (id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT id AS value, postal_code AS label FROM tbl_postal_code';
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