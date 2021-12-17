const db = require('../configuration/dbConn');
const admin = require('../configuration/sendNotification');

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
                        admin.notification({title: "New order has been placed", body: "Click to open"});
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
                resolve(result.reverse());
            }
        })
    });
};

exports.get_orders_user = async (id = 1) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_order WHERE order_status != 'can' AND user_id = ${id};`
        db.query(query, (err, order) => {
            if (err) {
                const error = new Error(err);
                reject(error);
            } else {
                if (!order.length) {
                    resolve([])
                } else {
                    let queryOrderedProducts = `SELECT tbl_ordered_products.order_id, tbl_ordered_products.product_id, tbl_products.price, tbl_products.name, tbl_products.image, tbl_ordered_products.quantity FROM tbl_ordered_products JOIN tbl_products ON tbl_ordered_products.product_id = tbl_products.id WHERE order_id IN (${order.map(obj => obj.id).join(', ')});`
                    db.query(queryOrderedProducts, (err, result) => {
                        if (err) {
                            const error = new Error(err);
                            reject(error);
                        } else {
                            let data = []
                            order.forEach(order => {
                                order.products = result.filter(product => product.order_id === order.id)
                                data.push(order)
                            })
                            resolve(data.reverse());
                        }
                    })
                }
            }
        })

    });
};

exports.get_product_price = async (products) => {
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
    const orderStatus = {
        req: 'Requested',
        pre: 'Preparing',
        ofd: 'Out for delivery',
        com: 'Completed',
        can: 'Cancelled'
    }
    const {id, order_status} = data;
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_order SET ? WHERE  id = ?';
        let value = [{order_status}, id];
        db.query(query, value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                const query_fcm_token = `SELECT tbl_fcm_token.token FROM tbl_fcm_token JOIN tbl_order ON tbl_fcm_token.user_id = tbl_order.user_id WHERE tbl_order.id = ${data.id}`;
                db.query(query_fcm_token, (err, result) => {
                    if (err || !result[0]) {
                        console.log({message: 'token not found'})
                    } else {
                        admin.notificationTo({title: `Your order is ${orderStatus[order_status]}`, body: "Click to open", token: result[0].token});
                    }
                })
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
                      admin.notification({title: `Order number ${id} has been cancelled`, body: "Click to open"});
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
