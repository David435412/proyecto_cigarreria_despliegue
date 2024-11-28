import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios';
import fuera_1 from '../assets/images/fuera_4.jpeg';
import { FaBeer, FaCandyCane, FaBox, FaSoap, FaPills, FaIceCream, FaWineBottle, FaCheese, FaBreadSlice } from 'react-icons/fa';

const categorias = [
    { nombre: 'Licores', icono: <FaWineBottle /> },
    { nombre: 'Confitería', icono: <FaCandyCane /> },
    { nombre: 'Enlatados', icono: <FaBox /> },
    { nombre: 'Aseo', icono: <FaSoap /> },
    { nombre: 'Drogas', icono: <FaPills /> },
    { nombre: 'Helados', icono: <FaIceCream /> },
    { nombre: 'Bebidas', icono: <FaBeer /> },
    { nombre: 'Lacteos', icono: <FaCheese /> },
    { nombre: 'Despensa', icono: <FaBreadSlice /> }
];

const Inicio = () => {
    const [productos, setProductos] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redirección

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const productosResponse = await axios.get('http://localhost:5000/productos/consulta');
                const pedidosResponse = await axios.get('http://localhost:5000/pedidos/consulta');

                const productosActivos = productosResponse.data.filter(producto => producto.estado === 'activo');
                setProductos(productosActivos);

                // Contar la cantidad total vendida de cada producto
                const conteoProductos = {};
                pedidosResponse.data.forEach(pedido => {
                    pedido.productos.forEach(producto => {
                        if (!conteoProductos[producto._id]) {
                            conteoProductos[producto._id] = {
                                ...producto,
                                cantidadTotal: 0
                            };
                        }
                        conteoProductos[producto._id].cantidadTotal += producto.cantidad;
                    });
                });

                // Convertir el objeto a un array y ordenar por cantidad total vendida
                const productosMasVendidosArray = Object.values(conteoProductos);
                productosMasVendidosArray.sort((a, b) => b.cantidadTotal - a.cantidadTotal);

                // Obtener los primeros 5 productos más vendidos
                setProductosMasVendidos(productosMasVendidosArray.slice(0, 4));
                setFilteredProducts(productosActivos);

            } catch (error) {
                setError('Error al obtener los datos');
                console.error('Error al obtener los datos', error);
            }
        };

        fetchDatos();
    }, []);

    useEffect(() => {
        if (categoriaSeleccionada === '') {
            setFilteredProducts(productos);
        } else {
            setFilteredProducts(productos.filter(producto => producto.categoria === categoriaSeleccionada));
        }
    }, [categoriaSeleccionada, productos]);

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada(''); // Limpiar categoría seleccionada para mostrar todos los productos
    };

    const handleDetallesProductoSinLoggear = (id) => {
        navigate(`/ProductoSinLoggear/${id}`); // Redirigir al componente DetallesProductoSinLoggear
    };

    return (
        <>
            <div className="bg-black text-white pb-5">
                <img
                    src={fuera_1}
                    alt="Fondo"
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Bienvenido a la Cigarrería Colonial</h1>
                    <p className="text-xl mt-2">Encuentra y realiza pedidos de los mejores productos</p>
                </div>
            </div>

            {/* Productos más vendidos */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mt-5 mb-4 text-center">Productos más vendidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productosMasVendidos.length > 0 ? (
                        productosMasVendidos.map(producto => (
                            <div
                                key={producto.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <div className="w-full h-48 relative flex-shrink-0">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="object-contain w-full h-full" // Usa object-contain para que la imagen no se corte
                                    />
                                </div>
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                        <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                    </div>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={() => handleDetallesProductoSinLoggear(producto.id)}
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </div>


                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay productos más vendidos disponibles.</p>
                    )}
                </div>
            </div>

            {/* Categorías y productos */}
            <div className="container mx-auto px-4 py-8">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Filtros por categorías */}
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                    <div
                        onClick={handleVerTodosClick}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-20 h-20 flex flex-col items-center justify-center transform ${categoriaSeleccionada === '' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-600 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                    >
                        <p className="text-center">Todos</p>
                    </div>
                    {categorias.map((categoria, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoriaClick(categoria.nombre)}
                            className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-20 h-20 flex flex-col items-center justify-center transform ${categoriaSeleccionada === categoria.nombre ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                            {categoria.icono}
                            <p className="text-center">{categoria.nombre}</p>
                        </div>
                    ))}
                </div>

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <div
                                key={producto._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <div className="w-full h-48 relative flex-shrink-0">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="object-contain w-full h-full" // Usa object-contain para que la imagen no se corte
                                    />
                                </div>
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                        <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                    </div>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={() => handleDetallesProductoSinLoggear(producto._id)}
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </div>

                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay productos disponibles en esta categoría.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Inicio;
