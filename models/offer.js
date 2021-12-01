const db = require('../configuration/dbConn');
const config = require('../configuration/config');


exports.add_offer = async (data) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_offers SET ?';
        let value = [data];
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

exports.get_offer_list = async () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT id, CONCAT('${config.API_DETAILS.URL + config.FILE.OFFER_IMAGE.PATH}', image) AS image FROM tbl_offers`;
        db.query(query, (err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.delete_offer = async (id) => {
    return new Promise((resolve, reject) => {
        let query = 'DELETE FROM tbl_offers WHERE id=?';
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

exports.get_single_offer = async (id) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT id, CONCAT('${config.API_DETAILS.URL + config.FILE.OFFER_IMAGE.PATH}', image) AS image FROM tbl_offers WHERE id=?`;
        let value = [id];
        db.query(query, value,(err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                resolve(result);
            }
        })
    });
};