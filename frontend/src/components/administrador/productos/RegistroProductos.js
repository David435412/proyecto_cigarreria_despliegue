import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importa los estilos de SweetAlert2

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

const RegistroProducto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: '',
        categoria: categorias[0], // Establecer el valor predeterminado a la primera categoría
        cantidad: '',
        marca: '',
        estado: 'activo'
    });
    const [error, setError] = useState('');
    const [proveedores, setProveedores] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Obtener la lista de proveedores desde la API
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:5000/proveedores/consulta');
                setProveedores(response.data);
            } catch (error) {
                console.error('Error al obtener los proveedores', error);
                setError('No se pudo cargar la lista de proveedores.');
            }
        };

        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar los datos del formulario antes de enviar
        console.log('Datos del formulario:', formData);

        try {
            await axios.post('http://localhost:5000/productos', formData);

            Swal.fire({
                title: 'Éxito',
                text: 'Producto registrado exitosamente.',
                icon: 'success',
                timer: 1500, // La alerta se mostrará durante 1.5 segundos
                showConfirmButton: false, // No mostrar botón de confirmación
                willClose: () => {
                    // Limpiar el formulario
                    setFormData({
                        nombre: '',
                        precio: '',
                        descripcion: '',
                        imagen: '',
                        categoria: categorias[0], 
                        cantidad: '',
                        marca: '', 
                        estado: 'activo'
                    });

                    // Redirigir a la vista de gestión de productos
                    navigate('/gestion-productos');
                }
            });
        } catch (error) {
            console.error('Error al registrar el producto', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar el producto.',
                icon: 'error',
                timer: 1500, // La alerta se mostrará durante 1.5 segundos
                showConfirmButton: false // No mostrar botón de confirmación
            });
        }
    };

    return (
        <section >
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto my-10 lg:py-0">
                <div className="w-full bg-white rounded-xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Registrar Nuevo Producto
                        </h1>

                        {error && <p className="text-red-500">{error}</p>}

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Imagen (URL)
                                    </label>
                                    <input
                                        type="text"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900">
                                            Categoría
                                        </label>
                                        <select
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                        >
                                            {categorias.map(categoria => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900">
                                            Cantidad
                                        </label>
                                        <input
                                            type="number"
                                            name="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                            min="1"
                                            max="1000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Marca
                                    </label>
                                    <select
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    >
                                        <option value="" disabled>Seleccione un proveedor</option>
                                        {proveedores.map((proveedor) => (
                                            <option key={proveedor.id} value={proveedor.nombre}>
                                                {proveedor.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-productos')}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700"                                >
                                    Registrar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistroProducto;
