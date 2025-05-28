import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
  phone: ""
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if(formData.email === "" || formData.password === "" || formData.userName === ""){
      toast({
        title: "Please, enter valid details!",
        variant: "destructive",
      });
      return false; 
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Please, enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }    


    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  // console.log(formData);

  return (
    <div className="mx-auto w-[95%] mt-[-50px] max-w-md space-y-6">
      <div className="text-center">
        <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
