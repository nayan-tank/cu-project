const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

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
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
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
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


const getRevenue = async (req, res) => {
  const { year } = req.params;
  try {
    const startOfYear = new Date(year, 0, 1); // January 1st
    const endOfYear = new Date(year, 11, 31, 23, 59, 59); // December 31st

    // console.log(startOfYear, endOfYear)

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


    // console.log("revenueByMonth", revenueByMonth)

    res.json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersYearly = async (req, res) => {
  try {
    const ordersByYear = await Order.aggregate([
      {
        $group: {
          _id: { $year: "$orderDate" }, // Group by year
          orderCount: { $sum: 1 }, // Count the number of orders
        },
      },
      {
        $sort: { _id: 1 }, // Sort by year in ascending order
      },
    ]);

    res.json(ordersByYear);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getRevenue,
  getOrdersYearly
};
