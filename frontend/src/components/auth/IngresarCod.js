import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import fuera_2 from "../../assets/images/fuera_2.jpeg";

// Función para encriptar la contraseña
const encriptarContrasena = (contrasena) => {
    return contrasena
        .split('')
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 3)) // Desplaza 3 posiciones en ASCII
        .join('');
};

// Función para validar la nueva contraseña
const validarContrasena = (contrasena) => {
    const regexMayuscula = /[A-Z]/; // Al menos una mayúscula
    const regexMinuscula = /[a-z]/; // Al menos una minúscula
    const regexNumero = /[0-9]/; // Al menos un número

    return (
        contrasena.length >= 8 && // Al menos 8 caracteres
        regexMayuscula.test(contrasena) &&
        regexMinuscula.test(contrasena) &&
        regexNumero.test(contrasena)
    );
};

const VerificarCodigo = () => {
    const [codigo, setCodigo] = useState('');
    const [correo, setCorreo] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleChangeCodigo = (e) => {
        setCodigo(e.target.value);
    };

    const handleChangeCorreo = (e) => {
        setCorreo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validación del correo
        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!correoRegex.test(correo)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Por favor, introduce un correo válido.',
            });
            return;
        }
    
        // Validación del código
        if (codigo.length !== 6 || isNaN(codigo)) {
            Swal.fire({
                icon: 'error',
                title: 'Código inválido',
                text: 'Por favor, introduce un código válido de 6 dígitos.',
            });
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5000/usuarios/verificar-codigo?correo=${correo}&codigo=${codigo}`);
    
            if (response.status === 200) {
                setIsModalOpen(true);  // Abre el modal para restablecer la contraseña
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || 'Ocurrió un error al verificar el código.',
            });
        }
    };

    const handleChangePassword = async (newPassword) => {
        if (!validarContrasena(newPassword)) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña inválida',
                text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
            });
            return;
        }
    
        // Solo pasamos la contraseña tal cual, sin encriptarla aquí
        console.log('Correo:', correo);
        console.log('Nueva contraseña:', newPassword);
    
        try {
            // Realizamos la solicitud PUT sin guardar la respuesta
            await axios.put('http://localhost:5000/usuarios/act', {
                correo,  // Asegúrate de que el correo esté disponible
                nuevaContrasena: newPassword, // Enviar la contraseña sin encriptar
            });
    
            // Si la solicitud fue exitosa
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La contraseña ha sido restablecida con éxito.',
            });
            navigate('/login');  // Redirige al login
        } catch (error) {

            console.log(error); // Imprime todo el error para depurar
            // Si ocurrió un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al restablecer la contraseña. Por favor, intenta más tarde.',
            });
        }
    };
    
    
    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <div className="absolute inset-0">
                <img
                    src={fuera_2}
                    alt="Fondo"
                    className="w-full h-full object-cover filter blur"
                />
                <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
            </div>
            <div className="relative z-10 w-full max-w-md p-6 mx-auto">
                <div className="text-center mb-6">
                    <a href="/inicio" className="text-4xl font-bold text-gray-300 hover:text-gray-100 transition-colors">
                        Colonial
                    </a>
                </div>
                <section className="bg-white bg-opacity-60 rounded-lg shadow-2xl">
                    <div className="space-y-4 p-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Verifica tu Código
                        </h1>
                        <form className="space-y-4 text-center" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="correo"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    id="correo"
                                    value={correo}
                                    onChange={handleChangeCorreo}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Tu correo electrónico registrado"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="codigo"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Código de Recuperación
                                </label>
                                <input
                                    type="text"
                                    name="codigo"
                                    id="codigo"
                                    value={codigo}
                                    onChange={handleChangeCodigo}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Ingresa el código de recuperación"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Verificar Código
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿No recibiste el correo? <a href="/recuperacion_contra" className="text-sm font-bold text-black">Reenvía el código</a>
                        </p>
                    </div>
                </section>
            </div>

            {/* Modal para cambiar la contraseña */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Restablecer Contraseña</h2>
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-4"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleChangePassword(e.target.value);
                                }
                            }}
                        />
                        <button
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            onClick={() => {
                                const passwordInput = document.querySelector('input[type="password"]');
                                handleChangePassword(passwordInput.value);
                            }}
                        >
                            Cambiar Contraseña
                        </button>
                        <button
                            className="w-full mt-2 text-gray-600 hover:text-gray-900"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificarCodigo;
