const db = require('../configuration/dbConn');

exports.getStatistics = (req, res, next) => {
    const data = {
        total_selling: 0,
        total_order: 0,
        total_bookings: 0,
        cenceled_orders: 0,
        total_users: 0,
        total_poducts: 0,
    }
    let queryOrders = 'SELECT * FROM tbl_order';
    let queryBookings = 'SELECT * FROM tbl_bookings';
    let queryProducts = 'SELECT * FROM tbl_products';
    let queryUsers = 'SELECT * FROM tbl_users';
    db.query(queryOrders, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        const completed_order = result.filter(item => item.order_status === 'com');
        if(completed_order.length){
            data.total_selling = completed_order.reduce((acc, item) => {return acc + item.total}, completed_order[0].total);
        }
        const canceled_order = result.filter(item => item.order_status === 'can');
        data.cenceled_orders = canceled_order.length
        data.total_order = result.length;
    })
    db.query(queryBookings, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        data.total_bookings = result.length;
    })
    db.query(queryProducts, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        data.total_poducts = result.length;
    })
    db.query(queryUsers, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        data.total_users = result.length;
        return res.status(200).json({
            message: 'Success',
            data: data,
            status: 1
        })
    })
};