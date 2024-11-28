import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import fuera_1 from "../../assets/images/fuera_2.jpeg";

const RegistroCliente = () => {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        contrasena: '',
        nombreUsuario: '',
        correo: '',
        telefono: '',
        direccion: '',
        tipoDocumento: '',
        numeroDocumento: '',
        estado: 'activo',
        rol: 'cliente'
    });

    const [validacionesContrasena, setValidacionesContrasena] = useState({
        longitud: false,
        mayusculas: false,
        minusculas: false,
        numeros: false
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [mensajeCorreo, setMensajeCorreo] = useState('');

    const navigate = useNavigate();

    // Función simple para "encriptar" la contraseña
    const encriptarContrasena = (contrasena) => {
        let contrasenaEncriptada = '';
        for (let i = 0; i < contrasena.length; i++) {
            // Cambia el carácter al siguiente en el código ASCII
            contrasenaEncriptada += String.fromCharCode(contrasena.charCodeAt(i) + 3);
        }
        return contrasenaEncriptada;
    };

    // Función para validar la contraseña
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
            setMensajeValidacion('La contraseña debe tener al menos 8 caracteres.');
        } else if (!tieneMayusculas) {
            setMensajeValidacion('La contraseña debe contener al menos una letra mayúscula.');
        } else if (!tieneMinusculas) {
            setMensajeValidacion('La contraseña debe contener al menos una letra minúscula.');
        } else if (!tieneNumeros) {
            setMensajeValidacion('La contraseña debe contener al menos un número.');
        } else {
            setMensajeValidacion('Contraseña segura.');
        }
    };

    const validarCorreo = (correo) => {
        // Verifica si el correo termina en @gmail.com
        if (!correo.endsWith('@gmail.com')) {
            setMensajeCorreo('El correo debe ser una dirección de Gmail (@gmail.com).');
        } else {
            setMensajeCorreo('');
        }
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        if (name === 'contrasena') {
            validarContrasena(value);
        } else if (name === 'correo') {
            validarCorreo(value); // Valida el correo al cambiar
        }
        setDatosFormulario({ ...datosFormulario, [name]: value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        // Primero validamos el correo
        if (mensajeCorreo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeCorreo,
            });
            return;
        }
        
        // Luego validamos la contraseña
    const errorContrasena = validarContrasena(datosFormulario.contrasena);
    if (mensajeValidacion !== 'Contraseña segura.') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeValidacion,
        });
        return;
    }

    try {
        const contrasenaEncriptada = encriptarContrasena(datosFormulario.contrasena);
        const datosAEnviar = {
            ...datosFormulario,
            contrasena: contrasenaEncriptada
        };

        await axios.post('http://localhost:5000/usuarios', datosAEnviar);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cliente registrado con éxito',
            showConfirmButton: false,
            timer: 1500
        });
        navigate('/login');
    } catch (error) {
        console.error('Error al registrar el cliente', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el cliente. Intenta nuevamente.',
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
                <div className="text-center mb-6">
                    <a href="/inicio" className="text-4xl font-bold text-gray-300 hover:text-gray-100 transition-colors">
                        Colonial
                    </a>
                </div>
                <section className="bg-white bg-opacity-60 rounded-lg shadow-2xl">
                    <div className="space-y-4 p-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Crea tu cuenta
                        </h1>
                        <form onSubmit={manejarEnvio}>
                            <div className="space-y-4 md:space-y-4 grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <label
                                        htmlFor="correo"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Correo Electrónico <p className='text-red-500'>*</p>
                                        <p className='text-red-500'>(debe ser un correo gmail)</p>

                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        id="correo"
                                        value={datosFormulario.correo}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="nombre@gmail.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="nombreUsuario"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Nombre de Usuario  <p className='text-red-500'>*</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreUsuario"
                                        id="nombreUsuario"
                                        value={datosFormulario.nombreUsuario}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="Tu nombre de usuario"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Nombre  <p className='text-red-500'>*</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={datosFormulario.nombre}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="Tu nombre completo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="telefono"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Teléfono  <p className='text-red-500'>*</p>
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        id="telefono"
                                        value={datosFormulario.telefono}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="3123456789"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="direccion"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Dirección  <p className='text-red-500'>*</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        id="direccion"
                                        value={datosFormulario.direccion}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="Tu dirección"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 col-span-2">
                                    <div className="w-full">
                                        <label
                                            htmlFor="tipoDocumento"
                                            className="block text-sm font-medium text-gray-900 flex"
                                        >
                                            Tipo de Documento  <p className='text-red-500'>*</p>
                                        </label>
                                        <select
                                            name="tipoDocumento"
                                            id="tipoDocumento"
                                            value={datosFormulario.tipoDocumento}
                                            onChange={manejarCambio}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                            required
                                        >
                                            <option value="">Selecciona un tipo de documento</option>
                                            <option value="Cédula">Cédula de Ciudadanía</option>
                                            <option value="Cédula Extranjera">Cédula de Extranjería</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="numeroDocumento"
                                            className="block text-sm font-medium text-gray-900 flex"
                                        >
                                            Número de Documento  <p className='text-red-500'>*</p>
                                        </label>
                                        <input
                                            type="text"
                                            name="numeroDocumento"
                                            id="numeroDocumento"
                                            value={datosFormulario.numeroDocumento}
                                            onChange={manejarCambio}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                            placeholder="Número de documento"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="contrasena"
                                        className="block text-sm font-medium text-gray-900 flex"
                                    >
                                        Contraseña  <p className='text-red-500'>*</p>
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        id="contrasena"
                                        value={datosFormulario.contrasena}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="Introduce tu contraseña"
                                        required
                                    />
                                    {mensajeValidacion && (
                                        <p className={`text-sm ${mensajeValidacion.includes('segura') ? 'text-green-600' : 'text-red-600'}`}>
                                            {mensajeValidacion}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 my-2 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Registrar
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta? <a href="/login" className="text-sm font-bold text-black">Inicia Sesión</a>
                        </p>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegistroCliente;
