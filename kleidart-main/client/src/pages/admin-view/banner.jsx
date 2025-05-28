import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // Import the delete action
} from "@/store/common-slice";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/ui/modal"; // Assume you have a modal component.

function AdminBanner() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null); // Store the ID of the image to be deleted
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    if (!uploadedImageUrls) {
      toast({
        title: "Invalid data",
        description: "Please, provide an image!",
        variant: "destructive",
      });
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrls)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrls(null);
      }
    });
  }

  function handleDeleteFeatureImage() {
    dispatch(deleteFeatureImage(currentImageId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Image Deleted",
          description: "The image was successfully removed.",
        });
        dispatch(getFeatureImages());
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the image.",
          variant: "destructive",
        });
      }
      setIsConfirmOpen(false);
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <>
      <div>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrls={uploadedImageUrls}
          setUploadedImageUrls={setUploadedImageUrls}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
          Upload
        </Button>
        <div className="flex flex-col gap-4 mt-5">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem, index) => (
                <div className="relative" key={featureImgItem._id || index}>
                  <img
                    src={featureImgItem.image}
                    alt="Feature"
                    className="w-full lg:h-[300px] object-cover rounded-t-lg"
                  />
                  <Button
                    onClick={() => {
                      setCurrentImageId(featureImgItem._id); // Set the current image ID
                      setIsConfirmOpen(true); // Open confirmation modal
                    }}
                    className="absolute top-2 right-2 bg-black text-white lg:h-10 h-8"
                  >
                    Delete
                  </Button>
                </div>
              ))
            : null}
        </div>
      </div>

      {isConfirmOpen && (
        <Modal onClose={() => setIsConfirmOpen(false)}>
          <div className="p-4">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p>Are you sure you want to delete this image?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button
                onClick={handleDeleteFeatureImage}
                className="bg-red-500 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default AdminBanner;
