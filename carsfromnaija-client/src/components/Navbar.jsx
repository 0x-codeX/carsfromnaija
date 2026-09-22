import { Link } from "react-router-dom";
import Logo from "../assets/Logo1.png";

const Navbar =
  () => {
    return (
      <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center relative">
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

          {/* Right Side Wrapper (Desktop) / Contact Wrapper (Mobile) */}
          <div className="flex items-center z-10">
            {/* Inventory Link: Absolute center on mobile, grouped right on desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto md:mr-8">
              <Link
                to="/inventory"
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Inventory
              </Link>
            </div>

            {/* Right: WhatsApp Contact Button */}
            <a
              href="https://wa.me/2348059975887"
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
