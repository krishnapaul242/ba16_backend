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

// exports.checkout_order = async (order) => {
//     return new Promise((resolve, reject) => {
//         let query = 'INSERT INTO tbl_orders SET ?';
//         let value = [order];
//         db.query(query, value, (err, result) => {
//             if (err) {
//               const error = new Error(err);
//               reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     });
// };


// exports.update_table_booking = async (booking, id) => {
//     return new Promise((resolve, reject) => {
//         let query = 'UPDATE tbl_table_booking SET ? WHERE  id = ?';
//         let value = [booking, id];
//         db.query(query, value, (err, result) => {
//             if (err) {
//               const error = new Error(err);
//               reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     });
// };

// exports.get_product_list = async () => {
//     return new Promise((resolve, reject) => {
//         let query = `SELECT name, description, price, discount_price, is_nonveg, is_avaliable, category,   CONCAT('${config.API_DETAILS.URL + config.FILE.PRODUCT_IMAGE.PATH}', image) AS img_url FROM tbl_products WHERE status = "1"`;
//         db.query(query, (err, result) => {
//             if (err) {
//                 const error = new Error(err);
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     });
// };