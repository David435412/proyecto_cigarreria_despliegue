import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaWhatsapp, FaPhone } from "react-icons/fa"; // Importa los íconos que necesitas
import Logo from "../../assets/images/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-300 px-4 lg:px-6 py-4 rounded-t-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Logo y Título */}
        <Link to="/" className="flex items-center mb-4 lg:mb-0 space-x-3">
          <img src={Logo} alt="Logo" className="w-60 h-auto" />
        </Link>

        {/* Información de Contacto */}
        <div className="flex flex-col lg:flex-row items-center text-gray-600">
          <div className="flex items-center mb-2 lg:mb-0 lg:mr-6">
            <FaMapMarkerAlt className="text-gray-700 mr-2" />
            <a href="https://maps.app.goo.gl/VKw7i6ouKbvR7jzU9" className="text-sm">Chapinero Alto, Calle 57 #5-04</a>
          </div>
          <div className="flex items-center mb-2 lg:mb-0 lg:mr-6">
            <FaWhatsapp className="text-green-500 mr-2" />
            <p className="text-sm">313 3000604 - 321 3313788</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-700 mr-2" />
            <p className="text-sm">3475838</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
