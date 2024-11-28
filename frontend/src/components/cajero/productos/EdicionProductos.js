import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const categorias = [
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

const EditarProducto = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: '',
        categoria: '',
        cantidad: '',
        marca: '',
        estado: 'activo'
    });
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/productos/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener el producto', error);
                setError('No se pudo cargar el producto.');
            }
        };

        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:5000/proveedores');
                setProveedores(response.data);
            } catch (error) {
                console.error('Error al obtener los proveedores', error);
                setError('No se pudo cargar la lista de proveedores.');
            }
        };

        fetchProducto();
        fetchProveedores();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Actualizar el estado del producto basado en la cantidad
        const updatedFormData = {
            ...formData,
            estado: formData.cantidad > 0 ? 'activo' : 'inactivo'
        };

        try {
            await axios.put(`http://localhost:5000/productos/${id}`, updatedFormData);
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Producto actualizado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/productos-cajero');
        } catch (error) {
            console.error('Error al actualizar el producto', error);
            setError('No se pudo actualizar el producto.');
        }
    };

    return (
        <section class="bg-gray-50">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto my-10 lg:py-0">
                <h1 class="text-3xl font-bold mb-4">Editar Producto</h1>

                {error && <p class="text-red-500 mb-4">{error}</p>}
                {alertMessage && (
                    <div class="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                        {alertMessage}
                    </div>
                )}

                <div class="w-full bg-white rounded-xl shadow-2xl md:mt-0 sm:max-w-4xl xl:p-0 border border-gray-200">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form class="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Imagen (URL)</label>
                                <input
                                    type="text"
                                    name="imagen"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.imagen}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Categoría</label>
                                <select
                                    name="categoria"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                >
                                    {categorias.map(categoria => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div class="col-span-1">
                                <label class="block text-gray-700 font-medium">Cantidad</label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="1000"
                                />
                            </div>
                            <div class="col-span-2">
                                <label class="block text-gray-700 font-medium">Marca</label>
                                <select
                                    name="marca"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.marca}
                                    onChange={handleChange}
                                    required
                                >
                                    {proveedores.map(proveedor => (
                                        <option key={proveedor.id} value={proveedor.nombre}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div class="col-span-2 flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/productos-cajero')}
                                    class="px-8 py-4 bg-gradient-to-r from-red-400 to-red-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    class="px-8 py-4 bg-gradient-to-r from-green-400 to-green-700  text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Actualizar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditarProducto;
