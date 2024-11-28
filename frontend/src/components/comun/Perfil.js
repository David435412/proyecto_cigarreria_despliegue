import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importamos el ícono de react-icons


const Profile = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        nombreUsuario: '',
        correo: '',
        telefono: '',
        direccion: '',
        tipoDocumento: '',
        numeroDocumento: '',
        contrasena: ''  // Para comparación de contraseña
    });
    const [validacionesContrasena, setValidacionesContrasena] = useState({});
    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [editedData, setEditedData] = useState({ ...userData });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            const nombre = localStorage.getItem('name');
            const nombreUsuario = localStorage.getItem('username');
            const correo = localStorage.getItem('email');
            const telefono = localStorage.getItem('phone');
            const direccion = localStorage.getItem('address');
            const tipoDocumento = localStorage.getItem('documentType');
            const numeroDocumento = localStorage.getItem('documentNumber');
            const contrasena = localStorage.getItem('password');
            const id = localStorage.getItem('userId');
            const rol = localStorage.getItem('role');
            const estado = localStorage.getItem('status');

            setUserData({
                nombre,
                nombreUsuario,
                correo,
                telefono,
                direccion,
                tipoDocumento,
                numeroDocumento,
                contrasena
               
            });
            setEditedData({
                nombre,
                nombreUsuario,
                correo,
                telefono,
                direccion,
                tipoDocumento,
                numeroDocumento,
                rol,
                estado,
                contrasena
            });
            setUserId(id);
        };

        fetchData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const validateEmail = (email) => {
        // Verificar si el correo tiene el dominio @gmail.com
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return regex.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));

        // Validar el correo si el campo modificado es el correo
        if (name === 'correo') {
            if (!validateEmail(value)) {
                setEmailError('El correo debe ser una dirección válida de Gmail (@gmail.com).');
            } else {
                setEmailError(''); // Limpiar el mensaje de error si es válido
            }
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        // Verifica si hay errores de validación
        if (emailError) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, corrige los errores antes de continuar.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2563eb'
            });
            return; // Detiene la ejecución si hay errores
        }
    
        try {
            await axios.put(`http://localhost:5000/usuarios/loggeado/${userId}`, editedData);
    
            localStorage.setItem('name', editedData.nombre);
            localStorage.setItem('username', editedData.nombreUsuario);
            localStorage.setItem('email', editedData.correo);
            localStorage.setItem('phone', editedData.telefono);
            localStorage.setItem('address', editedData.direccion);
            localStorage.setItem('documentType', editedData.tipoDocumento);
            localStorage.setItem('documentNumber', editedData.numeroDocumento);
            localStorage.setItem('password', editedData.contrasena);
            localStorage.setItem('role', editedData.rol);
            localStorage.setItem('status', editedData.estado);
    
            setUserData(editedData);
            closeModal();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el perfil. Inténtalo nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };  
    
    

    const encriptarContrasena = (contrasena) => {
        return contrasena
            .split('')
            .map((char) => String.fromCharCode(char.charCodeAt(0) + 3)) // Desplaza 3 posiciones en ASCII
            .join('');
    };

    const validarContrasena = (contrasena) => {
        const minLength = 8;
        const longitudValida = contrasena.length >= minLength;
        const tieneMayusculas = /[A-Z]/.test(contrasena);
        const tieneMinusculas = /[a-z]/.test(contrasena);
        const tieneNumeros = /[0-9]/.test(contrasena);

        setValidacionesContrasena({
            longitud: longitudValida,
            mayusculas: tieneMayusculas,
            minusculas: tieneMinusculas,
            numeros: tieneNumeros
        });

        if (!longitudValida) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        } else if (!tieneMayusculas) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        } else if (!tieneMinusculas) {
            return 'La contraseña debe contener al menos una letra minúscula.';
        } else if (!tieneNumeros) {
            return 'La contraseña debe contener al menos un número.';
        } else {
            return 'Contraseña segura.';
        }
    };

    const handleChangePassword = async () => {
        const { value: currentPassword } = await Swal.fire({
            title: 'Ingrese su contraseña actual',
            input: 'password',
            inputLabel: 'Contraseña actual',
            inputPlaceholder: 'Ingrese su contraseña actual',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#2563eb',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe ingresar su contraseña actual';
                }
            }
        });
    
        if (currentPassword) {
            const cifradaCurrentPassword = encriptarContrasena(currentPassword);
    
            try {
                const response = await axios.post(`http://localhost:5000/usuarios/${userId}/verificar-contrasena`, {
                    contrasenaActual: cifradaCurrentPassword
                });
    
                if (response.status === 200) {
                    // Mostrar formulario para la nueva contraseña
                    const { value: newPassword } = await Swal.fire({
                        title: 'Ingrese su nueva contraseña',
                        input: 'password',
                        inputLabel: 'Nueva contraseña',
                        inputPlaceholder: 'Ingrese su nueva contraseña',
                        showCancelButton: true,
                        confirmButtonText: 'Cambiar',
                        confirmButtonColor: '#2563eb',
                        cancelButtonText: 'Cancelar',
                        preConfirm: (newPassword) => {
                            const mensajeValidacion = validarContrasena(newPassword);
                            if (mensajeValidacion !== 'Contraseña segura.') {
                                Swal.showValidationMessage(mensajeValidacion);
                            }
                            return newPassword;
                        }
                    });
    
                    if (newPassword) {
                        const cifradaNewPassword = encriptarContrasena(newPassword);
    
                        await axios.put(`http://localhost:5000/usuarios/${userId}/cambiar-contrasena`, {
                            nuevaContrasena: cifradaNewPassword
                        });
    
                        localStorage.setItem('password', newPassword);
                        setUserData({ ...userData, contrasena: newPassword });
    
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Contraseña cambiada con éxito',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#2563eb'
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data.message || 'Ocurrió un error al verificar la contraseña',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };
      

    const handleBack = () => {
        // Usar window.history.back() si no usas React Router
        // window.history.back();

        // O usa navigate si usas react-router-dom
        navigate(-1);
    };

    return (
        <div className="max-w-4xl bg-gray-200 mx-auto my-10 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Perfil del Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Nombre</p>
                    <p className="text-lg text-gray-800">{userData.nombre}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Nombre de Usuario</p>
                    <p className="text-lg text-gray-800">{userData.nombreUsuario}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Correo</p>
                    <p className="text-lg text-gray-800">{userData.correo}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Teléfono</p>
                    <p className="text-lg text-gray-800">{userData.telefono}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm md:col-span-2">
                    <p className="text-sm font-semibold text-gray-500">Dirección</p>
                    <p className="text-lg text-gray-800">{userData.direccion}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Tipo de Documento</p>
                    <p className="text-lg text-gray-800">{userData.tipoDocumento}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Número de Documento</p>
                    <p className="text-lg text-gray-800">{userData.numeroDocumento}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                <button 
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    onClick={openModal}
                >
                    Editar Perfil
                </button>
                <button
                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
                    onClick={handleChangePassword}
                >
                    Cambiar Contraseña
                </button>
            </div>

            <div className="mt-8">
                <button
                    className="flex px-6 py-2 items-center bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
                    onClick={handleBack}
                >
                    <FaArrowLeft className="mr-2" /> {/* Icono de flecha hacia la izquierda */}
                    Volver
                </button>
            </div>


            {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Editar Perfil</h2>
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="correo">
                        Correo
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="email"
                        id="correo"
                        name="correo"
                        value={editedData.correo}
                        onChange={handleInputChange}
                    />
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>} {/* Mensaje de error */}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="telefono">
                        Teléfono
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={editedData.telefono}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="direccion">
                        Dirección
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={editedData.direccion}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Botones de acción */}
                <div className="col-span-2 flex justify-end mt-6 space-x-4">
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSaveChanges}
                    >
                        Guardar Cambios
                    </button>
                    <button
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={closeModal}
                    >
                        Cancelar
                    </button>
                </div>
                
            </form>
            
        </div>
    </div>
)}


  
        </div>

        
    );
};

export default Profile;
