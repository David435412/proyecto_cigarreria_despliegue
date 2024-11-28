import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importa useLocation
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from '../../assets/images/Logo.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Obtiene la ubicación actual

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-300 border-b border-gray-300 shadow-md z-50">
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/inicio" className="flex items-center space-x-3">
                        <img src={Logo} alt="CigarreriaC - Logo" className="w-56 h-auto" />
                    </Link>
                    <div className="flex items-center lg:order-2 space-x-2">
                        <Link to="/login" className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-4 py-2 transition duration-300">Inicia Sesión</Link>
                    </div>
                    {/* Icono de hamburguesa */}
                    <div className="lg:hidden flex items-center z-50">
                        <button onClick={toggleMenu} className="text-gray-900">
                            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                    {/* Menú desplegable en móviles */}
                    <div className={`lg:hidden fixed top-0 left-0 w-full bg-gray-200 border-b border-gray-300 py-4 px-6 transition-transform transform ${isOpen ? "translate-y-0" : "-translate-y-full"} z-50`}>
                        <ul className="space-y-4">
                            {['/inicio', '/pedidos-a', '/carrito-a'].map((path) => (
                                <li key={path}>
                                    <Link 
                                        to={path} 
                                        className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${location.pathname === path ? 'bg-gray-400' : ''}`} // Cambia el color de fondo si es la ruta activa
                                        onClick={toggleMenu}
                                    >
                                        {path === '/inicio' ? 'Inicio' : path === '/pedidos-a' ? 'Pedidos' : 'Carrito'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="hidden lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-2 space-y-1 font-medium lg:flex-row lg:space-x-8 lg:space-y-0 lg:mt-0">
                            {['/inicio', '/pedidos-a', '/carrito-a'].map((path) => (
                                <li key={path}>
                                    <Link 
                                        to={path} 
                                        className={`block py-2 px-4 text-gray-900 hover:bg-gray-200 rounded-lg transition duration-300 ${location.pathname === path ? 'bg-gray-400' : ''}`} // Cambia el color de fondo si es la ruta activa
                                        aria-current={location.pathname === path ? "page" : undefined}
                                    >
                                        {path === '/inicio' ? 'Inicio' : path === '/pedidos-a' ? 'Pedidos' : 'Carrito'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
