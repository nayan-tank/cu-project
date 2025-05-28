const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }

    let imageUrls = await Promise.all(
      req.files.map(async (file) => {
        // Log only the essential file information to avoid circular reference errors
        console.log("Uploading file:", file.originalname);
        return await imageUploadUtil(file.buffer, file.mimetype);
      })
    );

    res.json({
      success: true,
      result: imageUrls,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while uploading images.",
    });
  }
};




//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      // brand,
      category,
      price,
      salePrice,
      // totalStock,
      averageReview,
    } = req.body;

    // console.log("AddProductimage", req.body)

    // console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({
      image:  Array.isArray(image) ? image : [image],
      title,
      description,
      category,
      // brand,
      price,
      salePrice,
      // totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  // console.log("Cookies: ", req.cookies); 

  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      // brand,
      price,
      salePrice,
      // totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    // findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    // findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({ 
      success: true,
      data: findProduct,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
