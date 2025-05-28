import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useLocation } from "react-router-dom";


const FooterBar = () => {

  // Assuming you're storing the user data in Redux
  const location = useLocation();
  
  // If the user's role is 'admin', don't render the footer
  if (location.pathname.includes("admin")) {
    return null; // Return null to prevent rendering the footer
  }

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Flexbox container to distribute sections with specific widths */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Left Section: About Us and Copyright - 40% width */}
          <div className="space-y-4 w-full md:w-3/5">
            <div>
              <h3 className="text-xl font-bold mb-2">About Us</h3>
              <p className="text-sm text-gray-400">
                At Kleidart Gifts, we offer a wide range of gift items for every occasion. Our mission is to bring joy and happiness through thoughtful and unique gifts.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                &copy; 2020 Kleidart Gifts. All rights reserved.
              </p>
              <p className="text-sm text-gray-400">
                Designed by <span className="font-bold text-gray-200">Kleidart Gifts</span>
              </p>
            </div>
          </div>

          {/* Center Section: Contact Us - 30% width */}
          <div className="space-y-4 w-full md:w-1/3 flex justify-center items-center">
            <div className="">
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Phone: +916351852557</li>
                <li>Email: info@kleidartgifts.com</li>
                <li>Location: 3rd Floor, SUMEL BUSINESS PARK-6, D-336, Dudheshwar, Ahmedabad, Gujarat 380004</li>
              </ul>
            </div>
          </div>

          {/* Right Section: Follow Us - 30% width */}
          <div className="space-y-4 w-full md:w-1/3 flex lg:justify-center lg:items-center md:justify-center md:items-center">
            <div className="">
              <h3 className="text-xl font-bold mb-2">Follow Us</h3>
              <div className="flex justify-center space-x-6 text-gray-400">
                <a
                  href="https://www.facebook.com/Kleidartofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://www.instagram.com/kleidartofficial__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/company/kleidart/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
