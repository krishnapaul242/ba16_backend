const { encode } = require('html-entities');
const path = require('path');
const base64Img = require("base64-img");
const jimp = require('jimp');
const fs = require('fs');
const {add_minutes} = require('../shared/datetime');
const config = require('../configuration/config');
const orderModel = require('../models/order');
// const productModel = require('../models/product');

exports.add_order = async (req, res, next) => {
    const UID = Date.now()
    try {
        const {
            delivery_charge,
            ordered_products,
            total,
            address,
            order_type,
            order_status,
            payment_status,
            payment_comment,
            user_id,
            user_name,
            user_phone
        } = req.body;

        let order = {
            id: UID,
            delivery_charge,
            total,
            address: JSON.stringify(address),
            order_type,
            order_status,
            payment_status,
            payment_comment,
            user_id,
            user_name,
            user_phone
        };
        // console.log(order)
        await orderModel.add_order(order, ordered_products).then(async () => {
            return res.status(200).json({
                message: "Your Order Submitted Successfully",
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

exports.update_payment_status = async (req, res, next) => {
    try {
        const data = req.body;

        await orderModel.update_payment_status(data).then(async () => {
            return res.status(200).json({
                message: "Payment status updated successfully",
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

exports.update_order_status = async (req, res, next) => {
    try {
        const data = req.body;

        await orderModel.update_order_status(data).then(async () => {
            return res.status(200).json({
                message: "Order status updated successfully",
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

exports.get_orders = async (req, res, next) => {
    try {
        orderModel.get_orders(req.params.order_status).then(async (data) => {
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

exports.check_order = (req, res, next) => {
    const { product_details, address_pincode } = req.body
    let data = {
        products: [],
        delivery_charge: 0,
        total: 0,
    }
    function get_delivery_charge() {
        switch (address_pincode) {
            case '742101':
                return 25
            case '742102':
                return 30
            case '742103':
                return 30
            default:
                return 0;
        }
    }
    product_details.forEach(async (e, i) => {
        try {
            const price = await orderModel.get_product_prize(e.product_id)
            data.products.push({
                ...e,
                price: price,
                sub_total: price * e.quantity
            })
            if (product_details.length === i+1) {
                const result = {
                    ...data,
                    delivery_charge: get_delivery_charge(),
                    total : data.products.reduce((acc, cur) => acc + cur.sub_total, 0) + get_delivery_charge()
                }
                res.send(result)
            }
        } catch (error) {
            reject(error)
        }
    })
};




