import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const RegistroProveedor = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        estado: 'activo'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/proveedores', formData);
            
            // SweetAlert para confirmar el registro exitoso
            Swal.fire({
                icon: 'success',
                title: 'Registrado',
                text: 'Proveedor registrado con éxito',
                showConfirmButton: false,
                timer: 1500 // tiempo de 1.5 segundos antes de redirigir
            }).then(() => {
                navigate("/gestion-proveedores");
            });
        } catch (error) {
            console.error('Error al registrar el proveedor', error);
            
            // SweetAlert para el error
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo registrar el proveedor. Inténtalo de nuevo más tarde.',
            });
        }
    };

    return (
        <div>
            <section>
                <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto my-10 lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Registro de Proveedor
                            </h1>
                            <form className="flex flex-col gap-6 md:gap-8" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Nombre del proveedor"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="3123456789"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-900">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        id="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700"                                >
                                    Registrar Proveedor
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistroProveedor;
