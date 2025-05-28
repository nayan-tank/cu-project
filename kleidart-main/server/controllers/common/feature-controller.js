const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if(!image){
      // console.log(image, "image");
      return res.status(400).json({
        success: false,
        message: "Please, provide image!",
      });
    }

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id)
      const feature = await Feature.findByIdAndDelete(id);

      // console.log("feature", feature)
  
      if (!feature)
        return res.status(404).json({
          success: false,
          message: "Feature not found",
        });
  
      res.status(200).json({
        success: true,
        message: "Feature delete successfully",
      });
    } catch (e) {
      // console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }

};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
