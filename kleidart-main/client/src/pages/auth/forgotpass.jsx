import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";// Assuming a button component exists
import { Input } from "@/components/ui/input"; // Assuming an input component exists
import { useToast } from "@/components/ui/use-toast"; // Assuming a toast component exists

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call your forgot password API here
      // Example API call
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          // title: "Success",
          title: "Password reset link has been sent to your email.",
        });
        setEmail("");
      } else {
        const errorData = await response.json();
        // console.log(errorData)
        toast({
          title: "Error",
          description: errorData.message || "Failed to send reset email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-[95%] max-w-md w-[87%] lg:mt-[-100px] mt-[-70px] mb-20 space-y-6">
      <div className="text-center">
        <h1 className="lg:text-3xl  md:text-3xl text-2xl font-bold tracking-tight text-foreground">
          Forgot Password
        </h1>
        <p className="mt-2">
          Remembered your password?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email Address
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mt-2 w-full mb-[-2px]"
        />
      </div>
      <div>
        <Button className="w-full" onClick={handleForgotPassword}>
          Send Reset Link
        </Button>
      </div>
    </div>
  );
}

export default ForgotPassword;
