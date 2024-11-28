import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import fuera_1 from "../../assets/images/fuera_2.jpeg";

// Función para encriptar la contraseña (método ASCII)
const encriptarContrasena = (contrasena) => {
    return contrasena
        .split('')
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 3)) // Desplaza 3 posiciones en ASCII
        .join('');
};

const Login = () => {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const contrasenaEncriptada = encriptarContrasena(formData.contrasena);

            const response = await axios.post('http://localhost:5000/usuarios/login', {
                correo: formData.correo,
                contrasena: contrasenaEncriptada
            });

            const user = response.data;
            console.log(user);
            localStorage.setItem('userId', user._id);
            localStorage.setItem('role', user.rol);
            localStorage.setItem('name', user.nombre);
            localStorage.setItem('username', user.nombreUsuario);
            localStorage.setItem('email', user.correo);
            localStorage.setItem('phone', user.telefono);
            localStorage.setItem('address', user.direccion);
            localStorage.setItem('documentType', user.tipoDocumento);
            localStorage.setItem('documentNumber', user.numeroDocumento);
            localStorage.setItem('status', user.estado);

            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Redirigiendo al panel...',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                switch (user.rol) {
                    case 'administrador':
                        navigate('/admin-dash');
                        break;
                    case "cliente":
                        navigate('/cliente-dash');
                        break;
                    case 'cajero':
                        navigate('/cajero-dash');
                        break;
                    case 'domiciliario':
                        navigate('/domiciliario-dash');
                        break;
                    default:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Rol desconocido, redirigiendo...',
                        }).then(() => navigate('/'));
                        break;
                }
                window.location.reload();
            });
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            Swal.fire({
                icon: 'error',
                title: 'Error en el inicio de sesión',
                text: error.response?.data?.message || 'Ocurrió un error al intentar iniciar sesión.',
            });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <div className="absolute inset-0">
                <img 
                    src={fuera_1} 
                    alt="Fondo" 
                    className="w-full h-full object-cover filter blur" 
                />
                <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
            </div>
            <div className="relative z-10 w-full max-w-md p-6 mx-auto">
                {/* Texto "Colonial" fuera del div blanco */}
                <div className="text-center mb-6">
                    <a href="/inicio" className="text-4xl font-bold text-gray-300 hover:text-gray-100 transition-colors">
                        Colonial
                    </a>
                </div>
                <section className="bg-white bg-opacity-60 rounded-lg shadow-2xl">
                    <div className="space-y-4 p-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Inicia Sesión con tu cuenta!
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
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Tu correo electrónico"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="contrasena"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    id="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Ingresar
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Aún no tienes cuenta? <a href="/registro-cliente" className="text-sm font-bold text-black">Regístrate</a>
                        </p>
                        <p className="text-sm text-gray-600">
                            ¿Olvidaste tu contraseña? <a href="/recuperacion_contra" className="text-sm font-bold text-black">Haz clic aqui</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
