import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import fuera_1 from '../../assets/images/fuera_4.jpeg';
import { FaBeer, FaCandyCane, FaBox, FaSoap, FaPills, FaIceCream, FaWineBottle, FaCheese, FaBreadSlice, FaShoppingCart } from 'react-icons/fa';
import Carrito from './productos/Cart'; // Ajusta la ruta según la ubicación de tu componente Carrito

Modal.setAppElement('#root'); // Asegúrate de que el id sea el de tu elemento raíz

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

const ClienteDashboard = () => {
    const [productos, setProductos] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const { data: productosData } = await axios.get('http://localhost:5000/productos/consulta');
                const pedidosResponse = await axios.get('http://localhost:5000/pedidos/consulta');
    
                const productosActivos = productosData.filter(producto => producto.estado === 'activo');
                setProductos(productosActivos);
                setFilteredProducts(productosActivos);

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
                
                // Obtener los primeros 4 productos más vendidos
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
                            <Link
                                to={`/productos/${producto.id}`}
                                key={producto.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <div className="w-full h-64 relative flex-shrink-0">
                                <img src={producto.imagen} alt={producto.nombre} className="object-contain w-full h-64" />



                                </div>
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                        <p className="text-gray-900 font-bold mb-4">${parseFloat(producto.precio).toFixed(3)}</p>
                                    </div>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={() => {
                                            // Lógica para agregar al carrito
                                            console.log('Producto agregado al carrito:', producto);
                                        }}
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </Link>
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
                            <Link
                                to={`/productos/${producto._id}`}
                                key={producto._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
                            >
                                <div className="w-full h-64 relative">
                                <img src={producto.imagen} alt={producto.nombre} className="object-contain w-full h-64" />


                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                    <p className="text-gray-900 font-bold mb-4">${parseFloat(producto.precio).toFixed(3)}</p>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-auto"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
                    )}
                </div>
            </div>

            {/* Botón para abrir el modal */}
            <button
                onClick={() => setModalIsOpen(true)}
                className="fixed bottom-8 right-8 bg-green-600 text-white py-3 px-5 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform transform-gpu hover:scale-110"
            >
                <FaShoppingCart size={24} />
            </button>

            {/* Modal del carrito */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Carrito"
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-4/5 max-h-screen overflow-auto relative">
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        &times;
                    </button>
                    <Carrito onClose={() => setModalIsOpen(false)} /> {/* Pasando la función onClose */}
                </div>
            </Modal>

        </>
    );
};

export default ClienteDashboard;
