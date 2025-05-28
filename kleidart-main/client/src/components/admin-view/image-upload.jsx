import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";


function ProductImageUpload({
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [imageFiles = [], setImageFiles] = useState([]); 

  function handleImageFileChange(event) {
    const selectedFiles = event.target.files;
    // console.log("selectedFiles", selectedFiles)
    if (selectedFiles) {
      setImageFiles([...imageFiles, ...Array.from(selectedFiles)]);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImageFiles([...imageFiles, ...droppedFiles]);
  }

  function handleRemoveImage(index) {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
  }

  async function uploadImagesToCloudinary() {
    setImageLoadingState(true);
    const uploadedUrls = [];

    for (let file of imageFiles) {
      const data = new FormData();
      data.append("images", file);

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products/upload-image`,
        data,
        { withCredentials: true }
      )
      .then(response => {

        response.data.result.forEach(item => {
          uploadedUrls.push(item.url)
        });
        
        setUploadedImageUrls(uploadedUrls);
        setImageLoadingState(false);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }

  useEffect(() => {
    if (imageFiles.length > 0) uploadImagesToCloudinary();
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 ${isEditMode ? "opacity-60" : ""}`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          multiple
          disabled={isEditMode}
        />
        {!imageFiles.length ? (
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-32 cursor-pointer ${isEditMode ? "cursor-not-allowed" : ""}`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
          </Label>
        ) : (
          imageFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between mt-2">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{file.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveImage(index)}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
