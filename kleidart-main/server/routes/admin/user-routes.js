// routes/admin.js
const express = require("express");
const router = express.Router();

const {
    getUsersList,
    updateUser,
    deleteUser,
    getUserDetails
  } = require("../../controllers/admin/user-controller");
  


router.get("/get", getUsersList);
router.get("/get/:id", getUserDetails);
router.put("/update/:id", updateUser);
router.put("/delete/:id", deleteUser);

module.exports = router 
