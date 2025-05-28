import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Utility function to check if user is authenticated
  const isAuthenticated = () => {
    // Get the cookies from document.cookie as a string
    const cookies = document.cookie;
    // console.log("cookies", cookies); // Log the token value (if any)
  
    // Look for the cookie with the name 'token'
    const isUserAuthenticated = cookies
      .split('; ') // Split cookies by semicolon and space
      .find(row => row.startsWith('isUserAuthenticated=')) // Find the cookie with name 'token'
      ?.split('=')[1] === 'true'; // Extract the value after '='
  
    // console.log("isUserAuthenticated=", isUserAuthenticated); // Log the token value (if any)
  
    return isUserAuthenticated; // Return true if token exists, otherwise false
  };
  

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  function onSubmit(event) {
    event.preventDefault();

    if(formData.email === "" || formData.password === ""){
      toast({
        title: "Please, enter valid credentails!",
        variant: "destructive",
      });
      return false; 
    }

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        // console.log(data)
        if (data?.payload?.user.role == "admin") {
          navigate("/admin/dashboard");
        }
        else{
          navigate("/")
        }
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-[95%]  lg:mt-[-100px] mt-[-100px]  md:mt-[-30%] w-[87%]  max-w-md space-y-6 relative">
      <div className="text-center">
        <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-blue-700 underline hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* Forgot Password link */}
        <Link
          className="font-medium text-primary underline hover:underline absolute right-0 "
          to="/auth/forgot-password"
        >
          Forgot Password
        </Link>
    </div>
  );
}

export default AuthLogin;
