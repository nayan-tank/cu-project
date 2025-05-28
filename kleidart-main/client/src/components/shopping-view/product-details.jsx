import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  // const [nameonproduct, setName] = useState(""); // New state for name
  // const [color, setColor] = useState(""); // New state for color
  const [note, setNote] = useState(""); // New state for note
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // function handleAddToCart(getCurrentProductId, getTotalStock, nameonproduct, color, note) {
  function handleAddToCart(getCurrentProductId, getTotalStock, note) {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    // if (!nameonproduct || !color || !note) {
    if (!note) {
      toast({
        title: "Invalid data provided!",
        description: "Please provide all required data to proceed!",
        variant: "destructive",
      });
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Handle adding to cart with name, color, and note
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        // nameonproduct,
        // color,
        note,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // console.log('Product is added to cart')
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setNote("");
    setOpen(false);
    dispatch(setProductDetails());
    // dispatch(clearProductCustomization());
    setRating(0);
    setReviewMsg("");
  }

  async function handleAddReview() {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a review.",
        variant: "warning",
      });
      navigate("/auth/login");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/shop/review/add`, {
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      });

      const { data } = response;

      if (data.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        console.log(data);
        toast({
          title: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // console.log(error);
      toast({
        title: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  // const averageReview =
  //   reviews && reviews.length > 0
  //     ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  //       reviews.length
  //     : 0;

  return (
    <Dialog className="" open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid overflow-scroll scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 lg:grid-cols-2 gap-8 max-h-[90vh] max-w-[90vw] lg:max-w-[70vw] ">
        <div className="relative sm:mt-5 lg:overflow-hidden rounded-lg">
          {/* <img
            src={productDetails?.image[0]}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square lg:h-[350px] h-[200px] md:h-[200px] lg:w-full md:w-full md:object-cover"
          /> */}

          <Carousel
          showThumbs={false}
          >
            {productDetails?.image && productDetails?.image.length > 0 ? (
              productDetails?.image.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`product-image-${index}`}
                    className="w-full h-[300px] md:h-[500px] lg:h-[500px] object-cover "
                  />
                  {/* <p className="legend">{`Image ${index + 1}`}</p> */}
                </div>
              ))
            ) : (
              <div>
                <p>No images available</p>
              </div>
            )}
          </Carousel>

          <div>
            <h1 className="lg:text-xl mt-5 font-bold ">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`lg:text-xl font-bold text-primary mt-3 ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price}.00
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="lg:text-2xl mt-3 font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}.00
              </p>
            ) : null}
          </div>
        </div>
        <div className="text-sm">
          {/* Form Section: Name, Color, and Note */}
          <div className="mt-4">
            {/* <div className="mb-4">
              <Label>Name on product</Label>
              <Input
                className="mt-2"
                value={nameonproduct}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <Label>Color: {color} </Label>
              <div className="flex gap-2 mt-2">
                <Button
                  className={`w-8 h-8 squared-full ${
                    color === "brown" ? "border-2 border-primary" : ""
                  }`}
                  style={{ backgroundColor: "brown" }}
                  onClick={() => setColor("brown")}
                />
                <Button
                  className={`w-8 h-8 squared-full ${
                    color === "black" ? "border-2 border-primary" : ""
                  }`}
                  style={{ backgroundColor: "black" }}
                  onClick={() => setColor("black")}
                />
                <Button
                  className={`w-8 h-8 squared-full ${
                    color === "blue" ? "border-2 border-primary" : ""
                  }`}
                  style={{ backgroundColor: "blue" }}
                  onClick={() => setColor("blue")}
                />
              </div>
            </div> */}

            <div className="mb-7">
              <Label>Customize</Label>
              <Textarea
                className="mt-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your customization details here"
              />
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock,
                    // nameonproduct,
                    // color,
                    note
                  )
                }
              >
                Add to cart
              </Button>
            )}
          </div>

          <Separator />
          <div className="max-h-[400px] lg:overflow-auto">
            <h2 className="lg:text-lg text-sm font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div className="flex gap-4" key={reviewItem.id || index}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center lg:gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="lg:mt-10 mt-8 h-[400px] flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Textarea
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                className="mt-2"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
