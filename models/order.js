const db = require('../configuration/dbConn');


exports.add_order = async (order, product) => {
    return new Promise((resolve, reject) => {
        let query_order = 'INSERT INTO tbl_order SET ?';
        let value_order = [order];
        db.query(query_order, value_order, (err, orderInfo) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                let keys = Object.keys(product[0]);
                let values = product.map( obj => keys.map( key => obj[key]));
                let query_product = `INSERT INTO tbl_ordered_products (${keys.join(', ')}) VALUES ?`;
                db.query(query_product, [values], (err, result) => {
                    if (err) {
                        db.query('DELETE FROM tbl_order WHERE id = ?', [order.id])
                        const error = new Error(err);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
            }
        })
    });
};

exports.get_orders = async (status) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_order WHERE order_status = '${status}'`;
        if (status === "com") {
            query = query + ' AND DATE(updated_at) = CURDATE()';
        }
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

exports.get_orders_user = async (id) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_order WHERE order_status = 'req' AND user_id = ${id}`;
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

exports.get_product_prize = async (products) => {
    const condition = products.reduce((a, c) => { return a + ',' + c.product_id }, products[0].product_id)
    let query = `SELECT price FROM tbl_products WHERE id in (${condition})`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                resolve(result);
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

exports.update_order_status_user = async (data) => {
    const {id, order_status} = data;
    return new Promise((resolve, reject) => {
        let querySearch = 'SELECT order_status FROM tbl_order WHERE  id = ?';
        let queryUpdate = 'UPDATE tbl_order SET ? WHERE  id = ?';
        let value = [{order_status}, id];

        db.query(querySearch, [id], (err, result) => {
            if (err || result[0].order_status !== "req") {
                reject({
                    message: err || "In Progress Order Can't Be Cancelled",
                    status: 0
                });
            } else {
                db.query(queryUpdate, value, (err, result) => {
                    if (err) {
                      const error = new Error(err);
                      reject(error);
                    } else {
                      resolve(result);
                    }
                })
            }
        })
    });
};

exports.check_status = async (req) => {
    const condition = req.reduce((a, c) => { return a + ',' + c.id }, req[0].id)
    let query = `SELECT id, order_status FROM tbl_order WHERE id in (${condition})`;
    return new Promise((resolve, reject) => {
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