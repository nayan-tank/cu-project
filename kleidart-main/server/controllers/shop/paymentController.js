const Razorpay = require("razorpay");
const crypto = require("crypto");
const { response } = require("express");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
require('dotenv').config();

const paymentProcess = async (req, res) => {
    try {
        const amount = req.body.totalAmount * 100

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        // console.log(amount);

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: req.body.userEmail
        }

        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    return res
                        .status(200)
                        .json({
                            data: order,
                            success: true,
                            msg: "Payment initialized!"
                        });
                }
                else {
                    // console.log(err)
                    return res
                        .status(400)
                        .send({
                            success: false,
                            msg: 'Something went wrong!'
                        });
                }
            }
        );

    } catch (error) {
        console.log("paymentProcess Exception", error)
        return res
            .status(500)
            .json({
                success: false,
                msg: "Internal Server Error!, please try again after some time"
            })
    }
}

const paymentVerify = async (req, res) => {
    try {
        // return res.status(200).json({msg:"Payment verified successfully", success: true});

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // console.log("paymentVerifyResponse", "===", razorpay_order_id, "===", razorpay_payment_id,"===", razorpay_signature)

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const resultSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature == resultSign) {
            return res
                .status(200)
                .json({
                    msg: "Payment verified successfully",
                    success: true
                });
        } else {
            return res
                .status(400)
                .json({
                    msg: "Payment verification Failed",
                    success: false
                })
        }

    } catch (error) {
        console.log("paymentVerify Exception", error)
        return res
            .status(500)
            .json({
                msg: "Internal Server Error!",
                success: false
            });
    }
}

const createOrder = async (req, res) => {
    try {
        const newlyCreatedOrder = new Order({
            ...req.body,
            paymentStatus: "Completed",
            paymentId: req.body.razorpay_payment_id
        })
        await newlyCreatedOrder.save()

        const { userId } = req.body;
        await Cart.deleteOne({ userId });

        return res
            .status(201)
            .json({
                success: true,
                msg: "Order placed successfully",
                data: newlyCreatedOrder,
            });

    } catch (error) {
        console.log("createOrder Exception", error)
        return res
            .status(500)
            .json({
                msg: "Internal Server Error, please try again later!",
                success: false
            })
    }
}

module.exports = { paymentProcess, paymentVerify, createOrder } 