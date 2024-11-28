import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { FaUsers } from 'react-icons/fa'; // Importar el ícono para usuarios inactivos

const UsuariosInactivos = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [usuarioAActivar, setUsuarioAActivar] = useState(null);

    const navigate = useNavigate();

    // Obtener los usuarios inactivos desde la API
    const fetchUsuariosInactivos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios');
            const usuariosInactivos = response.data.filter(usuario =>
                (usuario.rol === 'cajero' || usuario.rol === 'domiciliario') && usuario.estado === 'inactivo'
            );
            setUsuarios(usuariosInactivos);
        } catch (error) {
            console.error('Error al obtener los usuarios inactivos', error);
            setError('No se pudieron cargar los usuarios inactivos.');
        }
    };

    useEffect(() => {
        fetchUsuariosInactivos();
    }, []);

    const handleActivate = async (usuario) => {
        try {
            await axios.put(`http://localhost:5000/usuarios/${usuario.id}`, { ...usuario, estado: 'activo' });
            fetchUsuariosInactivos();
            setAlertMessage('Usuario activado exitosamente.');
        } catch (error) {
            console.error('Error al activar el usuario', error);
            setError('No se pudo activar el usuario.');
        }
    };

    const confirmarActivacion = (usuario) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas activar al usuario ${usuario.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleActivate(usuario);
                Swal.fire(
                    'Activado!',
                    'El usuario ha sido activado.',
                    'success'
                );
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Usuarios Inactivos</h1>
            <p className="mb-8">
                En esta sección podrás gestionar a los usuarios inactivos del sistema. Puedes visualizar los usuarios que están inactivos y activarlos si es necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">               
                <button
                    onClick={() => navigate('/gestion-usuarios')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaUsers className="inline-block mr-2" /> Volver a Usuarios Activos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-300 border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-green-600 text-white border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Nombre de Usuario</th>
                            <th className="p-4 text-left">Tipo Documento</th>
                            <th className="p-4 text-left">Número Documento</th>
                            <th className="p-4 text-left">Correo</th>
                            <th className="p-4 text-left">Teléfono</th>
                            <th className="p-4 text-left">Dirección</th>
                            <th className="p-4 text-left">Rol</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b border-gray-200">
                                    <td className="p-4">{usuario.nombre}</td>
                                    <td className="p-4">{usuario.nombreUsuario}</td>
                                    <td className="p-4">{usuario.tipoDocumento}</td>
                                    <td className="p-4">{usuario.numeroDocumento}</td>
                                    <td className="p-4">{usuario.correo}</td>
                                    <td className="p-4">{usuario.telefono}</td>
                                    <td className="p-4">{usuario.direccion}</td>
                                    <td className="p-4">{usuario.rol}</td>
                                    <td className="p-4 flex gap-1">                                        
                                        <button
                                            onClick={() => confirmarActivacion(usuario)}
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                                        >
                                            Activar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">
                                    No hay usuarios inactivos en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsuariosInactivos;
