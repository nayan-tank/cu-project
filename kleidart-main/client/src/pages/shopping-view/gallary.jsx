import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";


function ProductGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  // Fetch images from the API
  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
          `${API_BASE_URL}/api/common/gallery/get`
      );

      // Check if the `data` field exists and is an array
      if (data && Array.isArray(data.data)) {
        setImages(data.data); // Set the full array of objects
      } else {
        console.error("API response does not contain a valid `data` array.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images && images.length > 0 ? (
        images.map((productItem, index) => (
          <Card className="w-full max-w-sm mx-auto" 
            key={productItem.id || index}
          > 
            <div className="relative">
              <img
                src={productItem?.image}
                alt={productItem?.title}
                className="w-full lg:h-[300px] h-[160px] object-cover rounded-t-lg"
              />
            </div>
          </Card>
          
        ))
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <h3 className="text-3xl font-bold text-muted-foreground">
            Coming soon...
          </h3>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
