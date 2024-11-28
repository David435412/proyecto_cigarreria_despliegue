import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importa los estilos de SweetAlert2
import { FaArrowLeft, FaRedo } from 'react-icons/fa';

const categorias = [
    'Todos',
    'Licores', 
    'Confitería', 
    'Enlatados', 
    'Aseo', 
    'Medicamentos', 
    'Helados', 
    'Bebidas', 
    'Lacteos', 
    'Panadería'
];

const ProductosInactivos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [error, setError] = useState('');
    const [productoAReactivar, setProductoAReactivar] = useState(null);

    const navigate = useNavigate();

    // Obtener los productos de la API
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

    // Filtrar productos según la categoría seleccionada y estado inactivo
    const productosFiltrados = productos.filter(producto =>
        (categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada) && producto.estado === 'inactivo'
    );

    // Maneja el cambio de estado a activo
    const handleReactivar = (producto) => {
        setProductoAReactivar(producto);

        Swal.fire({
            title: 'Confirmar Reactivación',
            text: `¿Estás seguro de que quieres reactivar el producto "${producto.nombre}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Reactivar',
            cancelButtonText: 'Cancelar',           
           
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/productos/estado/${producto._id}`, { ...producto, estado: 'activo' });
                    fetchProductos();
                } catch (error) {
                    console.error('Error al reactivar el producto', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo reactivar el producto.',
                        icon: 'error'
                    });
                }
                setProductoAReactivar(null);
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Productos Inactivos</h1>
            <p className="mb-8">
                Aquí puedes gestionar los productos que han sido inactivados. Puedes reactivar los productos según sea necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/gestion-productos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Volver a Productos Activos
                </button>
            </div>

            <div className="mb-6">
                <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
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
                                <div className="flex gap-1">                                    
                                    <button
                                        onClick={() => handleReactivar(producto)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                    >
                                        <FaRedo className="mr-1" /> Reactivar
                                    </button>
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

export default ProductosInactivos;
