const db = require('../configuration/dbConn');
const config = require('../configuration/config');



exports.add_category = async (category) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_categories SET ?';
        let value = [category];
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

exports.delete_category = async (category) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE  tbl_categories SET status = "0" WHERE name = ? AND status = "1"';
        let value = [category];
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

exports.get_categories = async () => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT name FROM tbl_categories WHERE status = "1"';
        db.query(query,  (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.check_category = async (category) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT id, name FROM tbl_categories WHERE status = "1" AND name = ?';
        let value = [category];
        db.query(query,  value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.check_product = async (product) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM tbl_products WHERE status = "1" AND name = ?';
        let value = [product];
        db.query(query,  value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.add_product = async (product) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_products SET ?';
        let value = [product];
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


exports.update_product = async (product, name) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_products SET ? WHERE name = ? AND status = "1" ';
        let value = [product, name];
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

exports.delete_product = async (product) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_products SET status = "0" WHERE name = ? AND status = "1" ';
        let value = [product];
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
        let query = `SELECT id, name, description, price, discount_price, is_nonveg, is_avaliable, category,   CONCAT('${config.API_DETAILS.URL + config.FILE.PRODUCT_IMAGE.PATH}', image) AS img_url FROM tbl_products WHERE status = "1"`;
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

exports.get_product_details = async (id) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT id, name, description, price, discount_price, is_nonveg, is_avaliable, category,   CONCAT('${config.API_DETAILS.URL + config.FILE.PRODUCT_IMAGE.PATH}', image) AS img_url FROM tbl_products WHERE status = "1" AND id = ?`;
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
