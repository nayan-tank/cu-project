import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import Modal from "../ui/modal"; // Assume you have a modal component.

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div>
      <Card className="w-full max-w-sm mx-auto">
        <div>
          <div className="relative">
            <img
              src={product?.image[0]}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
          </div>
          <CardContent>
            <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
              >
                ₹{product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-bold">₹{product?.salePrice}</span>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              Edit
            </Button>
            <Button onClick={() => setIsConfirmOpen(true)}>Delete</Button>
          </CardFooter>
        </div>
      </Card>

      {isConfirmOpen && (
        <Modal onClose={() => setIsConfirmOpen(false)}>
          <div className="p-4">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  handleDelete(product?._id);
                  setIsConfirmOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminProductTile;
