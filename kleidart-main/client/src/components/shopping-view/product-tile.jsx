import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { ShoppingCart, WandSparkles } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCartClick = (productId, totalStock) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    handleAddtoCart(productId, totalStock);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image[0]}
            alt={product?.title}
            className="lg:w-full lg:h-[300px] w-full h-[130px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="lg:text-xl text-sm font-semibold mb-[-25px] md:mb-0 w-full h-12 overflow-hidden text-ellipsis whitespace-nowrap">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center lg:mb-2 md:mb-2 ">
            <span className="lg:text-[16px] text-[10px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } lg:text-lg text-sm  text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="lg:text-lg text-lg font-semibold text-primary">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleGetProductDetails(product?._id)}
            // onClick={() => handleCartClick(product?._id, product?.totalStock)}
            className="w-full text-sm h-8 lg:h-10 md:h-10 mb-[-5px]"
          >
            Customize
            {/* <WandSparkles /> */}
            {/* <ShoppingCart className="w-6 h-6" /> */}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
