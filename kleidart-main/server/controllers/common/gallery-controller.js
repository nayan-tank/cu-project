const Gallery = require("../../models/Gallery");

const addGalleryImage = async (req, res) => {
  try {
    const { image } = req.body;

    if(!image){
      // console.log(image, "image");
      return res.status(400).json({
        success: false,
        message: "Please, provide image!",
      });
    }

    const galleryImages = new Gallery({
      image,
    });

    await galleryImages.save();

    res.status(201).json({
      success: true,
      data: galleryImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getGalleryImage = async (req, res) => {
  try {
    const images = await Gallery.find({});

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

const deleteGalleryImage = async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id)
      const gallery = await Gallery.findByIdAndDelete(id);

      // console.log("feature", feature)
  
      if (!gallery)
        return res.status(404).json({
          success: false,
          message: "Gallery not found",
        });
  
      res.status(200).json({
        success: true,
        message: "Gallery delete successfully",
      });
    } catch (e) {
      // console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }

};

module.exports = { addGalleryImage, getGalleryImage, deleteGalleryImage };
