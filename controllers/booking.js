const bookingModel = require('../models/booking');

exports.add_booking = (req, res, next) => {
    bookingModel.add_booking(req.body).then(result => {
        return res.status(200).json({
            message: "Order booked successfully",
            data: {
                id: result.insertId
            },
            status: 1
        });
    }).catch(err => {
        const error = new Error(err);
        next(error);
    })
};

exports.get_bookings = (req, res, next) => {
    bookingModel.get_booking(req.params.status).then(result => {
        return res.status(200).json({
            message: "Order booked successfully",
            data: result,
            status: 1
        });
    }).catch(err => {
        const error = new Error(err);
        next(error);
    })
};

exports.change_status = async (req, res, next) => {
    bookingModel.change_status(req.body).then(() => {
        return res.status(200).json({
            message: "Booking Status Changed Successfully",
            data: [],
            status: 1
        });
    }).catch(err => {
        const error = new Error(err);
        next(error);
    });
};

exports.change_status_user = async (req, res, next) => {
    bookingModel.change_status_user(req.body).then(() => {
        return res.status(200).json({
            message: "Booking cancelled",
            data: [],
            status: 1
        });
    }).catch(err => {
        const error = new Error(err);
        next(error);
    });
};

exports.check_status = (req, res, next) => {
    try {
        bookingModel.check_status(req.body).then(async (data) => {
            return res.status(200).json({
                message: "Bookings fetched successfully",
                data: data,
                status: 1
            });
        }).catch(err => {
            next(err);
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }   
}