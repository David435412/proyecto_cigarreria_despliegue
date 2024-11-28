import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const EditarProveedor = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        estado: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/proveedores/consulta/${id}`);
                console.log(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener el proveedor', error);
                setError('No se pudo cargar el proveedor.');
            }
        };

        fetchProveedor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:5000/proveedores/actualizar/${id}`, formData);

            // Mostrar alerta de SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Proveedor actualizado exitosamente.',
                showConfirmButton: false,
                timer: 2000, // Cierre automático después de 2 segundos
            });

            // Redirigir después de la alerta
            setTimeout(() => {
                navigate('/gestion-proveedores');
            }, 2000);
        } catch (error) {
            console.error('Error al actualizar el proveedor', error);
            setError('No se pudo actualizar el proveedor.');
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto my-10 lg:py-0">
                <h1 className="text-3xl font-bold mb-4">Editar Proveedor</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mx-auto w-2/6 bg-white rounded-xl shadow-2xl md:mt-0 sm:max-w-4xl xl:p-0 border border-gray-200">
                    <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correo"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-span-3 flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-proveedores')}
                                    className="px-8 py-4 bg-gradient-to-r from-red-400 to-red-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-700  text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Actualizar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditarProveedor;
