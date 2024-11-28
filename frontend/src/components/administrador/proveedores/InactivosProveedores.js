import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importa los estilos de SweetAlert2
import { FaUsers } from 'react-icons/fa';

const ProveedoresInactivos = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [proveedorAActivar, setProveedorAActivar] = useState(null);

    const navigate = useNavigate();

    // Obtener los proveedores inactivos desde la API
    const fetchProveedoresInactivos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/proveedores');
            const proveedoresInactivos = response.data.filter(proveedor => proveedor.estado === 'inactivo');
            setProveedores(proveedoresInactivos);
        } catch (error) {
            console.error('Error al obtener los proveedores inactivos', error);
            setError('No se pudieron cargar los proveedores inactivos.');
        }
    };

    useEffect(() => {
        fetchProveedoresInactivos();
    }, []);

    // Maneja la activación del proveedor con SweetAlert2
    const handleActivate = (proveedor) => {
        Swal.fire({
            title: 'Confirmar Activación',
            text: `¿Estás seguro de que deseas activar al proveedor ${proveedor.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#40cb35',
            cancelButtonColor: '#ff0000',
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar',
           
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/proveedores/${proveedor.id}`, { ...proveedor, estado: 'activo' });
                    fetchProveedoresInactivos();
                    setAlertMessage('Proveedor activado exitosamente.');
                } catch (error) {
                    console.error('Error al activar el proveedor', error);
                    setError('No se pudo activar el proveedor.');
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Proveedores Inactivos</h1>
            <p className="mb-8">
                En esta sección podrás gestionar a los proveedores inactivos del sistema. Puedes visualizar los proveedores que están inactivos y activarlos si es necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">               
                <button
                    onClick={() => navigate('/gestion-proveedores')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaUsers className="inline-block mr-2" /> Volver a Proveedores Activos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-green-600 text-white border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Teléfono</th>
                            <th className="p-4 text-left">Correo</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.length > 0 ? (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.id} className="border-b border-gray-200">
                                    <td className="p-4">{proveedor.nombre}</td>
                                    <td className="p-4">{proveedor.telefono}</td>
                                    <td className="p-4">{proveedor.correo}</td>
                                    <td className="p-4 flex gap-1">                                        
                                        <button
                                            onClick={() => handleActivate(proveedor)}
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                                        >
                                            Activar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No hay proveedores inactivos en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProveedoresInactivos;
