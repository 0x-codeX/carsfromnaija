import {
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-8 pb-4 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Brand Copyright */}
        <div className="mb-4 md:mb-0 text-center md:text-left text-gray-400">
          <p className="font-bold text-lg text-white mb-1">
            CarsFromNaija
          </p>
          <p className="text-sm">
            &copy;{" "}
            {new Date().getFullYear()}{" "}
            All
            rights
            reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          <a
            href="https://www.facebook.com/share/1AXrvqLEUH/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            aria-label="Facebook"
          >
            <FaFacebook
              size={
                24
              }
            />
          </a>

          <a
            href="https://instagram.com/carsfromnaija"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
            aria-label="Instagram"
          >
            <FaInstagram
              size={
                24
              }
            />
          </a>

          <a
            href="https://www.tiktok.com/@carsfromnaija"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="TikTok"
          >
            <FaTiktok
              size={
                24
              }
            />
          </a>

          <a
            href="https://wa.me/2348059975887?text=Hi%20CarsFromNaija%2C%20I%20want%20to%20inquire%20about%20a%20car."
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-500 transition-colors duration-300"
            aria-label="WhatsApp"
          >
            <FaWhatsapp
              size={
                24
              }
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
