import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ForgetPassword from "./pages/auth/forgotpass";
import ResetPassword from "./pages/auth/resetpass";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminBanner from "./pages/admin-view/banner";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminGallery from "./pages/admin-view/gallery";
// import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ProductGallery from "./pages/shopping-view/gallary";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import FooterBar from "./components/common/footer";
import HeaderBar from "@/components/shopping-view/header"
import AdminUsers from "./pages/admin-view/users";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <HeaderBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ShoppingHome />} />
        <Route path="/shop/listing" element={<ShoppingListing />} />
        <Route path="/shop/search" element={<SearchProducts />} />
        <Route path="/shop/gallery" element={<ProductGallery />} />

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="banner" element={<AdminBanner />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          {/* <Route path="features" element={<AdminFeatures />} /> */}
        </Route>

        {/* Authenticated Shopping routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauth-page" element={<UnauthPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterBar />
    </div>
  );
}

export default App;
