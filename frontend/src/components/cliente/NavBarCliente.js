import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import Logo from '../../assets/images/Logo.png';

const HeaderCliente = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ubicación actual
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userName, setUserName] = useState(''); // Estado para almacenar el nombre del usuario

    // Obtener el nombre del usuario desde localStorage
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const closeUserMenu = () => setIsUserMenuOpen(false);

    // Función para determinar si la ruta actual coincide con el enlace
    const isActiveLink = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-300 border-b border-gray-300 shadow-md z-50">
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/cliente-dash" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="w-56 h-auto" />
                    </Link>

                    <div className="flex items-center lg:order-2 space-x-2">
                    {userName && <p className="text-gray-900">{userName}</p>}
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="text-gray-900">
                                <FaUserCircle className="w-6 h-6" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                                    <Link to="/perfil" className="block px-4 py-2 text-gray-900 hover:bg-gray-100" onClick={closeUserMenu}>Mi perfil</Link>
                                    <button onClick={() => { handleLogout(); closeUserMenu(); }} className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100">
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={toggleMenu} className="lg:hidden text-gray-900">
                            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>

                    <div className={`lg:hidden fixed top-0 left-0 w-full bg-gray-200 border-b border-gray-300 py-4 px-6 transition-transform transform ${isOpen ? "translate-y-0" : "-translate-y-full"} z-50`}>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/cliente-dash" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/cliente-dash') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`} onClick={toggleMenu}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/pedidos" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/pedidos') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`} onClick={toggleMenu}>Pedidos</Link>
                            </li>
                            <li>
                                <Link to="/carrito" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/carrito') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`} onClick={toggleMenu}>Carrito</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="hidden lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-2 space-y-1 font-medium lg:flex-row lg:space-x-8 lg:space-y-0 lg:mt-0">
                            <li>
                                <Link to="/cliente-dash" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/cliente-dash') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`} aria-current="page">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/pedidos" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/pedidos') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`}>Pedidos</Link>
                            </li>
                            <li>
                                <Link to="/carrito" className={`block py-2 px-4 text-gray-900 ${isActiveLink('/carrito') ? 'bg-gray-400' : 'hover:bg-gray-300'} rounded-lg transition duration-300`}>Carrito</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderCliente;
