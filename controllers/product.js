const { encode } = require('html-entities');
const path = require('path');
const base64Img = require("base64-img");
const jimp = require('jimp');
const fs = require('fs');
const config = require('../configuration/config');
const productModel = require('../models/product');

exports.add_category = async (req, res, next) => {
    try {
        const { name } = req.value.body;
        await productModel.add_category({ name: encode(name) }).then(async () => {
            return res.status(200).json({
                message: "Category added successfully",
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

exports.delete_category = async (req, res, next) => {
    try {
        const { name } = req.value.body;
        productModel.delete_category(encode(name)).then(async () => {
            return res.status(200).json({
                message: "Category deleted successfully",
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

exports.get_category_list = async (req, res, next) => {
    try {
        productModel.get_categories().then(async (data) => {
            return res.status(200).json({
                message: "Category fetch successfully",
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


exports.add_product = async (req, res, next) => {
    try {
        const {
            name,
            category,
            description,
            price,
            is_nonveg,
        } = req.value.body;

        let product = {
            name: encode(name),
            category: encode(category),
            description: encode(description),
            price: encode(price),
            is_nonveg: encode(is_nonveg),
            is_avaliable: req.value.body.is_avaliable ? encode(req.value.body.is_avaliable) : encode("Yes"),
            discount_price: req.value.body.discount_price ? encode(req.value.body.discount_price) : 0,
        };
         if (req.value.body.image && req.value.body.image != '') {
            const filePath = base64Img.imgSync(req.value.body.image, path.join('public', config.FILE.PRODUCT_IMAGE.PATH), Date.now());
            const pathArr = filePath.split('/');
            const fileName = pathArr[pathArr.length - 1];
            product.image = encode(fileName);
        }
        await productModel.add_product(product).then(async () => {
            return res.status(200).json({
                message: "Product added successfully",
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

exports.update_product = async (req, res, next) => {
    try {
        const {
            name,
            category,
            description,
            price,
            is_nonveg,
        } = req.value.body;

        let product = {
            category: encode(category),
            description: encode(description),
            price: encode(price),
            is_nonveg: encode(is_nonveg),
            is_avaliable: req.value.body.is_avaliable ? encode(req.value.body.is_avaliable) : encode("Yes"),
            discount_price: req.value.body.discount_price ? encode(req.value.body.discount_price) : 0,
        };

        if (req.value.body.image && req.value.body.image != '') {
            const productData = await productModel.check_product(name);
            const deletedImagePath = path.join("public", path.join(config.FILE.PRODUCT_IMAGE.PATH, productData[0].image));
            const filePath = base64Img.imgSync(req.value.body.image, path.join('public', config.FILE.PRODUCT_IMAGE.PATH), Date.now());
            const pathArr = filePath.split('/');
            const fileName = pathArr[pathArr.length - 1];
            product.image = encode(fileName);
            fs.unlinkSync(deletedImagePath);
        }
        await productModel.update_product(product, name).then(async () => {
            return res.status(200).json({
                message: "Product updated successfully",
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

exports.delete_product = async (req, res, next) => {
    try {
        const {
            name,
        } = req.value.body;
        const productData = await productModel.check_product(name);
        const deletedImagePath = path.join("public", path.join(config.FILE.PRODUCT_IMAGE.PATH, productData[0].image));
        await productModel.delete_product(name).then(async () => {
            fs.unlinkSync(deletedImagePath);
            return res.status(200).json({
                message: "Product deleted successfully",
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

exports.get_product_list = async (req, res, next) => {
    try {
        productModel.get_product_list().then(async (data) => {
            return res.status(200).json({
                message: "Product fetch successfully",
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
