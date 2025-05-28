const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(fileBuffer, mimetype) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer); // Upload the buffer
  });
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };