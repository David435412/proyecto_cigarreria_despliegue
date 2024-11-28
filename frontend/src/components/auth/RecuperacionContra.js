import React, { useState } from 'react';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import fuera_2 from "../../assets/images/fuera_2.jpeg";

const RecuperacionContrasena = () => {
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleChange = (e) => {
        setCorreo(e.target.value);
    };

    // Función para generar el código de recuperación
    const generarCodigo = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario

        const codigoRecuperacion = generarCodigo(); // Generamos el código en el frontend

        try {
            // Enviar solicitud al backend para guardar el código de recuperación
            const response = await axios.post('http://localhost:5000/usuarios/recuperar-contrasena', { correo, codigoRecuperacion });

            if (response.status === 200) {
                // Enviar el correo con el código usando EmailJS
                await emailjs.send('service_podqncg', 'template_xnpls19', {
                    to_name: 'Usuario',
                    to_correo: correo,
                    message: `Tu código de restablecimiento es: ${codigoRecuperacion}. Utiliza este código para restablecer tu contraseña.`,
                    from_name: 'Colonial Support'
                }, 'it57DOPi1-ZuX3rXe');

                // Mostrar mensaje de éxito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '¡Código enviado!',
                    text: 'Se ha enviado el código de recuperación a tu correo.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Redirigir a la página de ingresar código
                    navigate('/ingresar_codigo');
                });
            }
        } catch (error) {
            console.error('Error al recuperar la contraseña', error);
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al recuperar la contraseña. Intenta nuevamente.',
                confirmButtonText: 'Aceptar'
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
                            Restablecer tu Contraseña
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
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Tu correo electrónico registrado"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Recuperar Contraseña
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Ya la recordaste? <a href="/login" className="text-sm font-bold text-black">Inicia Sesión</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RecuperacionContrasena;
