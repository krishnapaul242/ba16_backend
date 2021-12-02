// const { encode } = require('html-entities');
const path = require('path');
// const base64Img = require("base64-img");
// const jimp = require('jimp');
const fs = require('fs');
const config = require('../configuration/config');
const offerModel = require('../models/offer');

exports.add_offer = async (req, res, next) => {
    const UID = Date.now()
    const data = {
        id: UID,
        image: '',
    }
    const image = req.files.image;
    const imageName = UID + '.' + image.name.split('.').reverse()[0]
    const uploadPath = path.join(__dirname, '../', 'public') + config.FILE.OFFER_IMAGE.PATH + imageName;
    try {
        await image.mv(uploadPath)
        data.image = imageName
        await offerModel.add_offer(data)
        return res.status(200).json({
            message: "Offer added successfully",
            status: 1
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.get_offer_list = async (req, res, next) => {
    try {
        offerModel.get_offer_list().then(async (data) => {
            return res.status(200).json({
                message: "offer fetch successfully",
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
};


exports.delete_offer = async (req, res, next) => {
    try {
        const { id, image } = req.body;
        const offer = await offerModel.get_single_offer(id)
        if (!offer.length)
            return res.status(404).json({
                message: "Offer doesn't exist",
                status: 0
            });
        const imageName = image.split('/').reverse()[0];
        const deletedImagePath = path.join(__dirname, '../', 'public') + config.FILE.OFFER_IMAGE.PATH + imageName;
        await offerModel.delete_offer(id).then(async () => {
            try {
                fs.unlinkSync(deletedImagePath);
                return res.status(200).json({
                    message: "Offer deleted successfully",
                    status: 1
                });
            } catch (err) {
                return res.status(200).json({
                    message: "Offer deleted successfully (There was an error while deleting the image)",
                    status: 1
                });
            }
        }).catch(err => {
            next(err);
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};