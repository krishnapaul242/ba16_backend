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
    let countQuery = `SELECT 'user' AS name, COUNT(*) AS number FROM tbl_users UNION
                      SELECT 'product',      COUNT(*)           FROM tbl_products UNION
                      SELECT 'booking',      COUNT(*)           FROM tbl_bookings;`
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
    db.query(countQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        data.total_bookings = result.find(a=> a.name === "user").number;
        data.total_poducts = result.find(a=> a.name === "product").number;
        data.total_users = result.find(a=> a.name === "booking").number;
        return res.status(200).json({
            message: 'Success',
            data: data,
            status: 1
        })
    })
};