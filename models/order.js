const db = require('../configuration/dbConn');
const config = require('../configuration/config');



exports.add_table_booking = async (booking) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_table_booking SET ?';
        let value = [booking];
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

exports.checkout_order = async (order) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_orders SET ?';
        let value = [order];
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


exports.update_table_booking = async (booking, id) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_table_booking SET ? WHERE  id = ?';
        let value = [booking, id];
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

exports.get_product_list = async () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT name, description, price, discount_price, is_nonveg, is_avaliable, category,   CONCAT('${config.API_DETAILS.URL + config.FILE.PRODUCT_IMAGE.PATH}', image) AS img_url FROM tbl_products WHERE status = "1"`;
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