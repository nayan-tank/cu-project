const express = require("express");
const { checkAdminRole } = require("../../middleware/authMiddleware");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.get("/get", getFeatureImages);
router.post("/add", checkAdminRole,  addFeatureImage);
router.delete("/delete/:id", checkAdminRole, deleteFeatureImage);

module.exports = router;
