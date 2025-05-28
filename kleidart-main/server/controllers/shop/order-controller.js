const Razorpay = require("razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
require('dotenv').config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// const createOrder = async (req, res) => {
//   // console.log(req)

//   try {
//     const { userId, cartItems, addressInfo, totalAmount, cartId } = req.body;

//     console.log(req.body)

//     // Create a Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       // amount: Math.round(totalAmount * 100), // Convert amount to paisa
//       amount: 100, // Convert amount to paisa
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     // Save the order to the database
//     const newlyCreatedOrder = new Order({
//       userId,
//       cartId,
//       cartItems,
//       addressInfo,
//       orderStatus: "created",
//       paymentMethod: "razorpay",
//       paymentStatus: "pending",
//       totalAmount,
//       orderDate: new Date(),
//       razorpayOrderId: razorpayOrder.id,
//     });

//     await newlyCreatedOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       orderId: newlyCreatedOrder._id,
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       key_id: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred while creating the order",
//     });
//   }
// };

const createOrder = async (req, res) => {
  try {
    // Destructure the incoming data from the request body
    const { userId, cartItems, addressInfo, totalAmount, cartId } = req.body;

    if (!userId || !cartItems || !addressInfo || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build the order object
    const order = {
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus: "Pending",
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };


    // console.log(order)

    // Save the order to the database
    // Replace this with the actual DB logic, e.g., Mongoose or Prisma
    const savedOrder = await Order.create(order); // Example with Mongoose
    // console.log("Order saved:", savedOrder);

    // Respond with the saved order or the necessary payment details
    res.status(201).json({
      message: "Order created successfully",
      orderId: savedOrder._id, // Return the unique order ID
      amount: totalAmount * 100, // Amount in paise for Razorpay
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
      razorpayOrderId: "example_razorpay_order_id", // Replace with generated Razorpay order ID
    });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } =
      req.body;

    let order = await Order.findById(orderId);

    if (!order || order.razorpayOrderId !== razorpayOrderId) {
      return res.status(404).json({
        success: false,
        message: "Order not found or mismatched order ID",
      });
    }

    // Verify Razorpay signature
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature",
      });
    }

    // Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";

    // Deduct stock for each product
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product || product.totalStock < item.quantity) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product: ${product?.title || "Unknown"}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete the cart after successful order
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured and order confirmed",
      data: order,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing the payment",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getRevenue = async (req, res) => {
  const { year } = req.params;
  try {
    const startOfYear = new Date(year, 0, 1); // January 1st
    const endOfYear = new Date(year, 11, 31, 23, 59, 59); // December 31st

    console.log(startOfYear, endOfYear)

    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);


    console.log("revenueByMonth", revenueByMonth)

    res.json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
