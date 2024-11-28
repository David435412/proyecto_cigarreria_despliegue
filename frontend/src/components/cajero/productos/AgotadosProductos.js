import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';

const ProductosAgotados = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Obtener los productos de la API
    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/productos');
            // Filtra productos cuyo stock es cero
            const agotados = response.data.filter(producto => producto.cantidad === 0);
            setProductos(agotados);
        } catch (error) {
            console.error('Error al obtener los productos', error);
            setError('No se pudieron cargar los productos.');
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Productos Agotados</h1>
            <p className="mb-8">
                En esta sección se muestran todos los productos cuyo stock es cero. Puedes visualizar los productos agotados y tomar acciones como agregar más stock.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
                <button
                    onClick={() => navigate('/productos-cajero')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <FaEdit className="inline-block mr-2" /> Volver a Gestión de Productos
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos agotados en la base de datos.</p>
                ) : (
                    productos.map((producto) => (
                        <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            <div className="w-full h-64 relative">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="object-cover w-full h-full absolute inset-0"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                <p className="text-gray-700 mb-4">Marca: {producto.marca}</p>
                                <p className="text-red-600 mb-4">Stock Agotado</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/editar-prod-cajero/${producto.id}`)}
                                        className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductosAgotados;
