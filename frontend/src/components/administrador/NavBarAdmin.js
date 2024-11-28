import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import Logo from '../../assets/images/Logo.png';

const HeaderAdmin = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation(); // Usa useLocation para obtener la ruta actual
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

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Función para verificar si la ruta es la actual
    const isActive = (path) => {
        return location.pathname === path ? 'bg-gray-400' : ''; // Aplica clase si es la ruta actual
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-300 border-b border-gray-300 shadow-md z-50">
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/admin-dash" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="w-56 h-auto" />
                    </Link>
                    <div className="flex items-center lg:order-2 space-x-2 relative">
                        {/* Nombre del usuario al lado del logo */}
                        {userName && <p className="text-gray-900">{userName}</p>}

                        {/* Menú desplegable de usuario */}
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="text-gray-900 focus:outline-none">
                                <FaUserCircle className="w-6 h-6" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <div className="px-4 py-2 text-gray-900 bg-gray-100 border-b border-gray-300">
                                        <p className="text-sm">Rol: Administrador</p>
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
                        {/* Icono de hamburguesa */}
                        <button onClick={toggleMenu} className="lg:hidden text-gray-900">
                            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                    {/* Menú desplegable en móviles */}
                    <div className={`lg:hidden fixed top-0 left-0 w-full bg-gray-200 border-b border-gray-300 py-4 px-6 transition-transform transform ${isOpen ? "translate-y-0" : "-translate-y-full"} z-50`}>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/admin-dash" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/admin-dash')}`} onClick={toggleMenu}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/gestion-usuarios" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-usuarios')}`} onClick={toggleMenu}>Usuarios</Link>
                            </li>
                            <li>
                                <Link to="/gestion-productos" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-productos')}`} onClick={toggleMenu}>Productos</Link>
                            </li>
                            <li>
                                <Link to="/gestion-proveedores" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-proveedores')}`} onClick={toggleMenu}>Proveedores</Link>
                            </li>
                            <li>
                                <Link to="/gestion-ventas" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-ventas')}`} onClick={toggleMenu}>Ventas</Link>
                            </li>
                            <li>
                                <Link to="/gestion-pedidos" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-pedidos')}`} onClick={toggleMenu}>Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Menú para pantallas grandes */} 
                    <div className="hidden lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-2 space-y-1 font-medium lg:flex-row lg:space-x-8 lg:space-y-0 lg:mt-0">
                            <li>
                                <Link to="/admin-dash" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/admin-dash')}`}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/gestion-usuarios" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-usuarios')}`}>Usuarios</Link>
                            </li>
                            <li>
                                <Link to="/gestion-productos" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-productos')}`}>Productos</Link>
                            </li>
                            <li>
                                <Link to="/gestion-proveedores" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-proveedores')}`}>Proveedores</Link>
                            </li>
                            <li>
                                <Link to="/gestion-ventas" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-ventas')}`}>Ventas</Link>
                            </li>
                            <li>
                                <Link to="/gestion-pedidos" className={`block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300 ${isActive('/gestion-pedidos')}`}>Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderAdmin;
