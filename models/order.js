const db = require('../configuration/dbConn');
const config = require('../configuration/config');


exports.add_order = async (order, product) => {
    return new Promise((resolve, reject) => {
        let query_order = 'INSERT INTO tbl_order SET ?';
        let value_order = [order];
        db.query(query_order, value_order, (err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                let query_product = 'INSERT INTO tbl_ordered_products SET ?';
                product.forEach(element => {
                    let value_product = [{...element, order_id: order.id}];
                    db.query(query_product, value_product, (err, result) => {
                        if (err) {
                          db.query('DELETE FROM tbl_order WHERE id = ?', [order.id])
                          const error = new Error(err);
                          reject(error);
                        } else {
                          resolve(result);
                        }
                    })
                })
            }
        })
    });
};

exports.get_orders = async (status) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_order WHERE order_status = '${status}'`;
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

exports.get_product_prize = async (id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT price FROM tbl_products WHERE id = ?';
        let value = [id];
        db.query(query, value, (err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                const price = result[0] && result[0].price;
                resolve(price);
            }
        })
    });
}

exports.update_payment_status = async (data) => {
    const {id, payment_status} = data;
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_order SET ? WHERE  id = ?';
        let value = [{payment_status}, id];
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

exports.update_order_status = async (data) => {
    const {id, order_status} = data;
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_order SET ? WHERE  id = ?';
        let value = [{order_status}, id];
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
