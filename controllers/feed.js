const feedModel = require("../models/feed");

exports.get_postal_code = async (req, res, next) => {
    try {
        await feedModel.get_postal_code().then(async (data) => {
            return res.status(200).json({
               message: "Postal Code fetch successfully",
               postal_code: data,
               status: 1
            });
        }).catch(err => {
            next(err);
        })
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};