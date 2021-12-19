const db = require('../configuration/dbConn');
const admin = require('../configuration/sendNotification');

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
        let query1 = `DELETE FROM tbl_bookings WHERE user_id=${user_id};`
        let query2 =  `INSERT INTO tbl_bookings SET ?;`
        let value = [book];
        db.query(query1, (err, result) => {
            if (err) {
              reject(error);
            }
            db.query(query2, value, (err, result) => {
                if (err) {
                  const error = new Error(err);
                  reject(error);
                } else {
                  admin.notification({title: `New table booked!`, body: "Click to open"});
                  resolve(result);
                }
            })
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
                resolve(result.reverse());
            }
        })
    });
};

exports.change_status = async (req) => {
    const bookingStatus = {
        req: 'requested',
        app: 'approved',
        can: 'cancelled',
        com: 'completed'
    }
    const {id, booking_status} = req
    return new Promise((resolve, reject) => {
        let query = 'UPDATE tbl_bookings SET ? WHERE  id = ?';
        db.query(query, [{booking_status}, id], (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                const query_fcm_token = `SELECT tbl_fcm_token.token FROM tbl_fcm_token JOIN tbl_bookings ON tbl_fcm_token.user_id = tbl_bookings.user_id WHERE tbl_bookings.id = ${id}`;
                db.query(query_fcm_token, (err, result) => {
                    if (err || !result[0]) {
                        console.log({message: 'token not found'})
                    } else {
                        admin.notificationTo({title: `Your table has been ${bookingStatus[booking_status]}`, body: "Click to open", token: result[0].token});
                    }
                })
                resolve(result);
            }
        })
    });
};

exports.change_status_user = async ({body, userId}) => {
    const {id, booking_status} = body
    return new Promise((resolve, reject) => {
        let query = `UPDATE tbl_bookings SET ? WHERE id = ? and booking_status = "req" and user_id = ${userId} `;
        db.query(query, [{booking_status}, id], (err, result) => {
            if (err) {
              const error = new Error(err);
              reject(error);
            } else {
                admin.notification({title: `Table no. ${id} has been cancelled`, body: "Click to open", topic: 'admin'});
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