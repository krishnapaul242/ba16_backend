const { encode } = require('html-entities');
const productModel = require('../../../models/product');


exports.check_category = async (req, res, next) => {
    try {
        const { name } = req.value.body;
        const method = req.method;
        let err = {};
        const categoryExist = await productModel.check_category(encode(name));
        if (method === "POST" && categoryExist && categoryExist.length > 0) {
            err.name = "Category already exist";
        } else if (method === "DELETE" && categoryExist && categoryExist.length == 0) {
            err.name = "Category not exist";
        }
        if (Object.keys(err).length > 0) {
            return res.status(400).json({
                error: err,
                status: 0,
            });
        } else {
            next();
        }

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};


exports.check_product = async (req, res, next) => {
    try {
        const method = req.method;
        let err = {};
        if (method === "POST") {
            const { name, category } = req.value.body;

            const productExist = await productModel.check_product(encode(name));
            const categoryExist = await productModel.check_category(encode(category));
            if (productExist.length > 0) {
                err.name = "Product already exist";
            }
            if (categoryExist.length == 0) {
                err.category = "Category not exist";
            }
        } else if (method === "PUT") {
            const { name, category } = req.value.body;
            const productExist = await productModel.check_product(encode(name));
            const categoryExist = await productModel.check_category(encode(category));
            if (productExist.length == 0) {
                err.name = "Product not exist";
            }
            if (categoryExist.length == 0) {
                err.category = "Category not exist";
            }
        } else if (method === "DELETE") {
            const { name } = req.value.body;
            const productExist = await productModel.check_product(encode(name));
            if (productExist.length == 0) {
                err.name = "Product not exist";
            }
        }
        if (Object.keys(err).length > 0) {
            return res.status(400).json({
                error: err,
                status: 0,
            });
        } else {
            next();
        }

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};