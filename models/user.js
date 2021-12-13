const db = require('../configuration/dbConn');
const config = require('../configuration/config');

exports.get_user_list = async () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT id,name, email, mobile_no,  address,   CONCAT('${config.API_DETAILS.URL + config.FILE.USER_PROFILE_IMAGE.PATH}', profile_image) AS img_url FROM tbl_users`;
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

exports.get_user_wrt_email = async (email) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT *  FROM tbl_users WHERE email = ?';
        let value = [email];
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

exports.get_user_wrt_mobile_no = async (mobile_no) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT *  FROM tbl_users WHERE mobile_no = ?';
        let value = [mobile_no];
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

exports.get_user_wrt_id = async (id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM tbl_users WHERE id = ?';
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

exports.check_updated_email = async (email, id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT *  FROM tbl_users WHERE email = ? AND id != ?';
        let value = [email, id];
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

exports.add_user = async (user, fcm_token) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_users SET ?';
        let value = [user];
        db.query(query, value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                add_fcm_token(result.insertId, fcm_token);
                resolve(result);
            }
        })
    });
};


exports.update_user = async (user, id) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_users SET ? WHERE id = ?';
        let value = [user, id];
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

exports.add_user_signin_log = async (log, req) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_users_login_log SET ?';
        let value = [log];
        db.query(query, value, (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                add_new_fcm_token(req.user.id, req.body.fcm_token);
                resolve(result.insertId);
            }
        })
    });
};

const add_fcm_token = async (user_id, token) => {
    let query = 'INSERT INTO tbl_fcm_token SET ?';
    let value = [{user_id, token}];
    db.query(query, value, (err, result) => {
        if (err) {
            const error = new Error(err);
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

const add_new_fcm_token = async (user_id, token) => {
    let query = 'UPDATE tbl_fcm_token SET ? WHERE user_id = ?';
    let value = [{token}, user_id];
    db.query(query, value, (err, result) => {
        if (err) {
            const error = new Error(err);
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

