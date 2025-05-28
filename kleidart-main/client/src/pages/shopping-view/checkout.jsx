import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { clearCart } from "@/store/shop/cart-slice"

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


  const totalCartAmount = cartItems?.items?.length
    ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
            currentItem?.quantity,
        0
      )
    : 0;

  const initPay = (data, orderDetails) => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalCartAmount,
        currency: data.currency,
        // name: "shoe.name",
        // description: "",
        // image: "shoe.img",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyURL = `${API_BASE_URL}/api/payment/verify`;
            const { data } = await axios.post(
              verifyURL,
              response
            );
            // console.log("InitPayHandlerResponse", response)
            if (data.success) {
              const createOrderURL =
                `${API_BASE_URL}/api/payment/create-order`;
              const { data } = await axios.post(createOrderURL, {
                ...orderDetails,
                ...response,
              });

              if (data.success) {
                dispatch(clearCart());
                navigate("/");
              } else {
                toast({
                  title: data.msg,
                  variant: "destructive",
                });
              }
            }
          } catch (error){
            console.log("initPay handler Exception", error)
            toast({
              title: "Something went wrong!",
              variant: "destructive",
            });
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log("initPay handler Exception", error)
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare the order details
      const orderDetails = {
        userId: user?.id, // Replace with the actual user ID
        userEmail: user?.email, // Replace with the actual user ID
        cartId: cartItems?.cartId, // Replace with the actual cart ID if available
        cartItems: cartItems?.items.map((item) => ({
          productId: item?.productId,
          title: item?.title,
          image: item?.image,
          price: item?.salePrice > 0 ? item?.salePrice : item?.price,
          quantity: item?.quantity,
          // nameonproduct: item?.nameonproduct,
          // color: item?.color,
          note: item?.note
        })),
        addressInfo: {
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
        },
        orderStatus: "Pending", // Initial order status
        paymentMethod: "Razorpay", // Payment method used
        paymentStatus: "Pending", // Initial payment status
        totalAmount: totalCartAmount, // Total cart amount
        orderDate: new Date(), // Current date
        orderUpdateDate: new Date(), // Current date as update date
      };

      // console.log(orderDetails)

      // Call the backend to create the order
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/payment`, orderDetails );
      // console.log("data", data)
      if (data.success) {
        const initPaymentResponse = initPay(data.data, orderDetails);
        
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 ? (
            cartItems.items.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))
          ) : (
            <p>Your cart is empty. Add some items to proceed!</p>
          )}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleCheckout} className="w-full mb-10">
              Checkout with Razorpay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
