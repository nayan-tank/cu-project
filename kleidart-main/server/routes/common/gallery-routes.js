const express = require("express");
const { checkAdminRole } = require("../../middleware/authMiddleware");

const {
  getGalleryImage,
  addGalleryImage,
  deleteGalleryImage
} = require("../../controllers/common/gallery-controller");

const router = express.Router();

router.get("/get", getGalleryImage);
router.post("/add", checkAdminRole,  addGalleryImage);
router.delete("/delete/:id", checkAdminRole, deleteGalleryImage);

module.exports = router;
