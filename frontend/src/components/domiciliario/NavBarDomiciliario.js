import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

const HeaderDomiciliario = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-300 border-b border-gray-300 shadow-md z-50">
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/domiciliario-dash" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="w-56 h-auto" />
                    </Link>
                    <div className="flex items-center lg:order-2 space-x-2 relative">
                        {/* Menú desplegable de usuario */}
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="text-gray-900 focus:outline-none">
                                <FaUserCircle className="w-6 h-6" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <div className="px-4 py-2 text-gray-900 bg-gray-100 border-b border-gray-300">
                                        <p className="text-sm">Rol: Domiciliario</p>
                                    </div>
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                to="/perfil"
                                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                                                onClick={toggleUserMenu}
                                            >
                                                Mi perfil
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderDomiciliario;
