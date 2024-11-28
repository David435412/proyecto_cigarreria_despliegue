import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import emailjs from 'emailjs-com'; // Importa EmailJS

// Función para generar una contraseña genérica aleatoria
const generarContrasena = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const contrasena = `${letras.charAt(Math.floor(Math.random() * letras.length))}${letras.charAt(Math.floor(Math.random() * letras.length))}${letras.charAt(Math.floor(Math.random() * letras.length))}${letras.charAt(Math.floor(Math.random() * letras.length))}${numeros.charAt(Math.floor(Math.random() * numeros.length))}${numeros.charAt(Math.floor(Math.random() * numeros.length))}${numeros.charAt(Math.floor(Math.random() * numeros.length))}`;
    return contrasena;
};

// Función para encriptar la contraseña
const encriptarContrasena = (contrasena) => {
    return contrasena
        .split('')
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 3)) // Desplaza 3 posiciones en ASCII
        .join('');
};

// Validación del correo
const validarCorreo = (correo) => {
    const regexCorreo = /^[^\s@]+@gmail\.com$/;
    return regexCorreo.test(correo);
};

const RegistroEmpleado = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        nombreUsuario: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        direccion: '',
        rol: '', // Inicializa como cadena vacía
        estado: 'activo',
        contrasena: '' // Atributo para la contraseña
    });

    const [validacionCorreo, setValidacionCorreo] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'correo') {
            setValidacionCorreo(validarCorreo(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar el correo antes de enviar el formulario
        if (validacionCorreo) {
            try {
                // Genera la contraseña
                const contrasenaGenerada = generarContrasena();
                const contrasenaEncriptada = encriptarContrasena(contrasenaGenerada); // Encripta la contraseña

                const datosAEnviar = {
                    ...formData,
                    contrasena: contrasenaEncriptada // Guarda la contraseña encriptada
                };

                // Enviar los datos al servidor
                await axios.post('http://localhost:5000/usuarios/empleados', datosAEnviar);

                // Enviar correo con EmailJS
                await emailjs.send('service_podqncg', 'template_sj29uf7', {
                    to_name: formData.nombre,
                    to_correo: formData.correo,
                    contrasenaGenerada: contrasenaGenerada, // Envía la contraseña original generada
                    from_name: 'Colonial Support'
                }, 'it57DOPi1-ZuX3rXe');

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Empleado registrado con éxito. Se ha enviado un correo con la contraseña generada.',
                    confirmButtonColor: '#28a745', // Verde
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate("/gestion-usuarios");
                });
            } catch (error) {
                console.error('Error al registrar el empleado', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al registrar el empleado.',
                    confirmButtonColor: '#d33', // Rojo
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            // Mostrar alerta de error si la validación del correo no es correcta
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, asegúrate de que el correo sea válido (debe ser @gmail.com).',
                confirmButtonColor: '#d33', // Rojo
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="flex justify-center py-10 bg-gray-50">
            <section className="w-full max-w-3xl bg-white rounded-lg shadow-2xl">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Registro de Empleado
                    </h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                placeholder="Nombre del empleado"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="nombreUsuario" className="block mb-2 text-sm font-medium text-gray-900">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                id="nombreUsuario"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Nombre de usuario"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-gray-900">
                                Tipo de Documento
                            </label>
                            <select
                                name="tipoDocumento"
                                id="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            >
                                <option value="" disabled>Seleccione el tipo de documento</option>
                                <option value="Cédula">Cédula</option>
                                <option value="Cédula Extranjera">Cédula Extranjera</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-gray-900">
                                Número de Documento
                            </label>
                            <input
                                type="text"
                                name="numeroDocumento"
                                id="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Número de documento"
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
                                placeholder="Correo electrónico"
                                required
                            />
                            {!validacionCorreo && formData.correo && (
                                <div className="mt-2 text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    El correo electrónico debe ser (@gmail.com)
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                id="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Teléfono"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                id="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Dirección"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="rol" className="block mb-2 text-sm font-medium text-gray-900">
                                Rol
                            </label>
                            <select
                                name="rol"
                                id="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            >
                                <option value="" disabled>Seleccione el rol</option>
                                <option value="cajero">Cajero</option>
                                <option value="domiciliario">Domiciliario</option>
                          </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Registrar Empleado
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default RegistroEmpleado;
