const { encode } = require('html-entities');
const path = require('path');
const base64Img = require("base64-img");
const jimp = require('jimp');
const fs = require('fs');
const {add_minutes} = require('../shared/datetime');
const config = require('../configuration/config');
const orderModel = require('../models/order');
const productModel = require('../models/product');

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

// exports.add_table_booking = async (req, res, next) => {
//     try {
//         const {
//             date,
//             time,
//             member
//         } = req.value.body;

//         let booking = {
//             user_id: req.user.id,
//             time: add_minutes(date + " " + time, 20 ),
//             date: new Date(date),
//             member: Number(member)
//         };
//         console.log(booking)
//         await orderModel.add_table_booking(booking).then(async () => {
//             return res.status(200).json({
//                 message: "Your table booking successfully",
//                 validUpto: booking.time,
//                 status: 1
//             });
//         }).catch(err => {
//             next(err);
//         });
//     } catch (err) {
//         const error = new Error(err);
//         next(error);
//     }
// };

// exports.update_product = async (req, res, next) => {
//     try {
//         const {
//             name,
//             category,
//             description,
//             price,
//             is_nonveg,
//         } = req.value.body;

//         let product = {
//             category: encode(category),
//             description: encode(description),
//             price: encode(price),
//             is_nonveg: encode(is_nonveg),
//             is_avaliable: req.value.body.is_avaliable ? encode(req.value.body.is_avaliable) : encode("Yes"),
//             discount_price: req.value.body.discount_price ? encode(req.value.body.discount_price) : 0,
//         };
//         await productModel.update_product(product, name).then(async () => {
//             return res.status(200).json({
//                 message: "Product updated successfully",
//                 status: 1
//             });
//         }).catch(err => {
//             next(err);
//         });
//     } catch (err) {
//         const error = new Error(err);
//         next(error);
//     }
// };



// exports.get_product_list = async (req, res, next) => {
//     try {
//         productModel.get_product_list().then(async (data) => {
//             return res.status(200).json({
//                 message: "Product fetch successfully",
//                 data: data,
//                 status: 1
//             });
//         }).catch(err => {
//             next(err);
//         });
//     } catch (err) {
//         const error = new Error(err);
//         next(error);
//     }
// };

// exports.user_order_checkout = async (req, res, next) => {
//     try {
//         const {
//            products
//         } = req.value.body;
//         let total = 0;
//         for (let i in products) {
// 		console.log(products[i]);
//              const product = await productModel.get_product_details(products[i].id);
// 		console.log(product[0]);
//              total += product[0].price * products[i].quantity;
//         }
//         const order = {
//             user_id: req.user.id,
//             products: JSON.stringify(products),
//             total_price: total,
//             status: "Pending",
//             paid: 0
//         };
//         await orderModel.checkout_order(order).then(async data => {
//                return res.status(200).json({
//                    message: "Your order successfully checkout",
//                    totla: total,
//                    orderID: data.insertId,
//                    status: 1
//                });
//         }).catch(err => {
//             next(err);
//         })
//     } catch (err) {
//         const error = new Error(err);
//         next(error);
//     }
// };






