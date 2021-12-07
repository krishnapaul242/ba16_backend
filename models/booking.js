const db = require('../configuration/dbConn');


exports.add_booking = async (req) => {
    const {
        number_of_prople,
        dateTime,
        booking_status,
        user_id,
        user_name,
        user_phone
    } = req
    const book = {
        number_of_prople,
        dateTime,
        booking_status,
        user_id,
        user_name,
        user_phone
    }
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO tbl_bookings SET ?';
        let value = [book];
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

exports.get_booking = async (status) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_bookings WHERE booking_status = '${status}'`;
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

exports.change_status = async (req) => {
    const {id, booking_status} = req
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_bookings SET ? WHERE  id = ?';
        db.query(query, [{booking_status}, id], (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                resolve(result);
            }
        })
    });
};

exports.check_status = async (req) => {
    const condition = req.reduce((a, c) => { return a + ',' + c.id }, req[0].id)
    let query = `SELECT id, booking_status FROM tbl_bookings WHERE id in (${condition})`;
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