const db = require('../configuration/dbConn');
const moment = require('moment');

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

exports.getChart = (req, res, next) => {
    const data = []
    let query = 'SELECT created_at FROM tbl_order WHERE DATE(`created_at`) = CURDATE() - INTERVAL 3 DAY';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error',
                status: 0
            })
        }
        const formatedData = result.map(item => {
            const time = parseInt(moment(item.created_at).format('HH'))
            return time < 12 ? time + 'am' : (time - 12) + 'PM'
        })
        formatedData.forEach(item => {
            const exist = data.find(a => a.time === item)
            if(exist){
                exist.order += 1
            }else{
                data.push({
                    time: item,
                    order: 1,
                })
            }
        })
        return res.status(200).json({
            message: 'Success',
            data: data,
            status: 1
        })
    })
}