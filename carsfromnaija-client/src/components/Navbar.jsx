import {
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo1.png";
import API from "../api/axios"; // Added API import

const Navbar =
  () => {
    // 1. Setup state with a fallback number
    const [
      whatsappNumber,
      setWhatsappNumber,
    ] =
      useState(
        "2348059975887",
      );

    // 2. Fetch global settings on mount
    useEffect(() => {
      const fetchSettings =
        async () => {
          try {
            const {
              data,
            } =
              await API.get(
                "/settings",
              );
            if (
              data?.dealerPhoneWhatsApp
            ) {
              // Clean the number (remove spaces, plus signs, dashes) for the wa.me link
              const cleanPhone =
                data.dealerPhoneWhatsApp.replace(
                  /\D/g,
                  "",
                );
              setWhatsappNumber(
                cleanPhone,
              );
            }
          } catch (error) {
            console.error(
              "Failed to load navbar settings:",
              error,
            );
          }
        };

      fetchSettings();
    }, []);

    return (
      <nav className="bg-purple-950 text-white py-4 shadow-md sticky top-0 z-50 border-b border-purple-900">
        <div className="w-full px-6 md:px-12 max-w-[1920px] mx-auto flex justify-between items-center relative">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center z-10"
          >
            <img
              src={
                Logo
              }
              alt="CarsFromNaija Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Right Side Wrapper */}
          <div className="flex items-center z-10">
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto md:mr-8">
              <Link
                to="/inventory"
                className="text-gray-300 hover:text-purple-400 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Inventory
              </Link>
            </div>

            {/* Right: Dynamic WhatsApp Contact Button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi%20CarsFromNaija%2C%20I%20want%20to%20inquire%20about%20a%20car.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg font-bold tracking-wide transition-all transform hover:scale-105 shadow-sm text-sm sm:text-base whitespace-nowrap"
            >
              Contact
              Us
            </a>
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;
