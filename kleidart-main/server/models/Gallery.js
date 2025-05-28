const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
