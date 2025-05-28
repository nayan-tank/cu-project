import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";// Assuming a button component exists
import { Input } from "@/components/ui/input"; // Assuming an input component exists
import { useToast } from "@/components/ui/use-toast"; 
import * as jose from "jose";

function ResetPassword() {
  const location = useLocation();// Token from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const SECRET_KEY = import.meta.env.VITE_JWT_SECRET || "your_jwt_secret_key";

  const verifyToken = async (token) => {
    try {
      const secret = new TextEncoder().encode(SECRET_KEY);
      const { payload } = await jose.jwtVerify(token, secret);
      // console.log("Token payload:", payload);
      return payload; // Return decoded payload
    } catch (error) {
      // console.error("Token verification failed:", error);
      throw new Error("Invalid or expired token");
    }
  };

  useEffect(() => {
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or expired token.",
        variant: "destructive",
      });
      navigate("/auth/login");
    }

    verifyToken(token)
    .then((payload) => {
      // console.log("Token is valid. Payload:", payload);
    })
    .catch(() => {
      toast({
        title: "Error",
        description: "Invalid or expired token.",
        variant: "destructive",
      });
      navigate("/auth/login");
    });
    
  }, [token, navigate, toast]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in both password fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        toast({
          // title: "Success",
          title: "Your password has been successfully reset.",
        });
        navigate("/auth/login");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to reset the password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-[95%] max-w-md space-y-6 mb-20">
      <div className="text-center">
        <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold tracking-tight text-foreground">
          Reset Your Password
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
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          New Password
        </label>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="mt-2 mb-[-10px] w-full"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="mt-2 mb-[-14px] w-full"
        />
      </div>
      <div>
        <Button className="w-full mt-4" onClick={handleResetPassword}>
          Reset Password
        </Button>
      </div>
    </div>
  );
}

export default ResetPassword;
