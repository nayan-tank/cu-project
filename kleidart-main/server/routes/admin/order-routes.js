const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getRevenue,
  getOrdersYearly
} = require("../../controllers/admin/order-controller");


const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.get("/revenue/:year", getRevenue);
router.get("/get/:year", getOrdersYearly);


module.exports = router;
