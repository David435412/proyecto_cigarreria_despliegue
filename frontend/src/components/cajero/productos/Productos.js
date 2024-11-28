import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBeer, FaCandyCane, FaBox, FaSoap, FaPills, FaIceCream, FaWineBottle, FaCheese, FaBreadSlice } from 'react-icons/fa'; // Agrega los iconos que necesitas

const categorias = [
    { nombre: 'Licores', icono: <FaWineBottle /> },
    { nombre: 'Confitería', icono: <FaCandyCane /> },
    { nombre: 'Enlatados', icono: <FaBox /> },
    { nombre: 'Aseo', icono: <FaSoap /> },
    { nombre: 'Drogas', icono: <FaPills /> },
    { nombre: 'Helados', icono: <FaIceCream /> },
    { nombre: 'Bebidas', icono: <FaBeer /> },
    { nombre: 'Lacteos', icono: <FaCheese /> },
    { nombre: 'Despensa', icono: <FaBreadSlice /> } // Cambiado "Panadería" por "Despensa"
];

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/productos/consulta');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos', error);
            setError('No se pudieron cargar los productos.');
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Filtrar productos según la categoría y el estado de agotamiento
    const productosFiltrados = productos
        .filter(producto => {
            if (categoriaSeleccionada === 'Todos') {
                return true;
            }
            return producto.categoria === categoriaSeleccionada && producto.estado === 'activo';
        })
        .sort((a, b) => {
            if (a.cantidad === 0 && b.cantidad > 0) {
                return -1; // Mostrar productos agotados primero
            }
            if (a.cantidad > 0 && b.cantidad === 0) {
                return 1; // Mostrar productos no agotados después de los agotados
            }
            return 0; // Mantener el orden original
        });

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada('Todos'); // Establecer a 'Todos' para mostrar todos los productos
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Productos</h1>
            <p className="mb-8 text-center">
                En esta sección podrás consultar todos los productos que ofrecemos y los productos agotados.
            </p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap justify-center gap-4">
                {/* Círculo para mostrar todos los productos */}
                <div
                    onClick={handleVerTodosClick}
                    className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-16 h-16 flex flex-col items-center justify-center transform ${categoriaSeleccionada === 'Todos' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-600 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                >
                    {/* Icono y nombre para "Todos" */}
                    <FaBeer size={24} className="mb-1" /> 
                    <span className="text-xs">Todos</span>
                </div>

                {categorias.map(({ nombre, icono }) => (
                    <div
                        key={nombre}
                        onClick={() => handleCategoriaClick(nombre)}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-16 h-16 flex flex-col items-center justify-center transform ${categoriaSeleccionada === nombre ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                    >
                        {/* Mostrar el ícono y el nombre debajo */}
                        {icono}
                        <span className="text-xs mt-1">{nombre}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <div 
                            key={producto.id} 
                            className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 ${producto.cantidad === 0 ? 'bg-red-100 border-red-400' : 'bg-white border-gray-200'}`}
                        >
                            <div className="w-full h-64 relative">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className={`object-contain w-full h-full absolute inset-0 ${producto.cantidad === 0 ? 'filter grayscale' : ''}`}
                                />
                                {producto.cantidad === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50">
                                        <p className="text-white text-lg font-bold">Agotado</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className={`text-xl font-semibold mb-2 ${producto.cantidad === 0 ? 'text-red-500' : 'text-gray-900'}`}>{producto.nombre}</h2>
                                <p className={`text-gray-900 font-bold mb-4 ${producto.cantidad === 0 ? 'text-red-500' : ''}`}>${producto.precio}</p>
                                <p className={`text-gray-700 mb-2 ${producto.cantidad === 0 ? 'text-red-500' : ''}`}>Marca: {producto.marca}</p> 
                                <p className={`text-gray-700 mb-4 ${producto.cantidad === 0 ? 'text-red-500' : ''}`}>Cantidad disponible: {producto.cantidad}</p>
                                <div className="flex gap-2">                                                                       
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay productos en esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default GestionProductos;
