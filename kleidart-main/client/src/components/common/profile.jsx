import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { fetchUserDetails, updateUserDetails } from "@/store/common-slice/user-profile";


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user = {}, loading = false, error = null } = useSelector((state) => state.user || {}); // Access user state

  // Local state for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
    // address: "",
  });

  // Fetch user details when the component mounts
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Update form data when user details change
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        // phone: user.phone || "",
        // address: user.address || "",
      });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form inputs
    // if (!formData.name || !formData.email || !/^[0-9]{10}$/.test(formData.phone)) {
    if (!formData.name || !formData.email ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    // Dispatch update user action
    dispatch(updateUserDetails(formData));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              disabled // Email is usually not editable
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div> */}

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              rows="3"
            />
          </div> */}

          <Button 
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md"
            onSubmit="" >
            Update Profile
          </Button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
