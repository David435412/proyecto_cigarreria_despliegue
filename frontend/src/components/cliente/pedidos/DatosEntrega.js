import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

const DatosEntrega = () => {
    const [carrito, setCarrito] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo'); // Estado para el método de pago
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            const usuarioId = localStorage.getItem('userId');
            if (usuarioId) {
                // Obtener el carrito del localStorage
                const carritoData = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
                setCarrito(carritoData);
    
                // Obtener direcciones del usuario desde la base de datos con async/await
                try {
                    const response = await axios.get(`http://localhost:5000/direcciones/consulta/?usuarioId=${usuarioId}`);
                    setDirecciones(response.data);
                } catch (error) {
                    console.error('Error al obtener direcciones:', error);
                }
    
                // Obtener datos del usuario desde localStorage
                setNombre(localStorage.getItem('name') || '');
                setCorreo(localStorage.getItem('email') || '');
                setTelefono(localStorage.getItem('phone') || '');
            }
        };
    
        obtenerDatos();
    }, []);
    

    const handleAgregarDireccion = async () => {
        const { value: nuevaDireccion } = await Swal.fire({
            title: 'Agregar Dirección',
            input: 'text',
            inputLabel: 'Dirección de Entrega',
            inputPlaceholder: 'Ingresa tu dirección',
            inputType: 'text',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#2563eb',
            cancelButtonText: 'Cancelar',            
        })
        ;

        if (nuevaDireccion) {
            const usuarioId = localStorage.getItem('userId');
            if (usuarioId) {
                try {
                    await axios.post('http://localhost:5000/direcciones', {
                        usuarioId,
                        direccion: nuevaDireccion
                    });                
                    setDirecciones([...direcciones, { direccion: nuevaDireccion }]);
                    window.location.reload();
                                                                
                } catch (error) {
                    console.error('Error al guardar la dirección:', error);
                    Swal.fire('Error', 'Hubo un problema al guardar la dirección.', 'error');
                }
            }   
                 
        }
        
    };

    const handleEditarDireccion = async (_id, direccionActual) => {
        console.log('ID de la dirección:', _id); // Verifica si el ID es _id
    
        const { value: nuevaDireccion } = await Swal.fire({
            title: 'Editar Dirección',
            input: 'text',
            inputLabel: 'Dirección de Entrega',
            inputValue: direccionActual,
            inputPlaceholder: 'Ingresa la nueva dirección',
            inputType: 'text',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#3b82f6',
            cancelButtonText: 'Cancelar',
        });
    
        if (nuevaDireccion) {
            try {
                const usuarioId = localStorage.getItem('userId');
                if (usuarioId) {
                    const response = await axios.put(`http://localhost:5000/direcciones/${_id}`, {
                        direccion: nuevaDireccion,
                        usuarioId
                    });
    
                    setDirecciones(direcciones.map(d => d._id === _id ? { ...d, direccion: nuevaDireccion } : d));
                    Swal.fire('Éxito', 'Dirección actualizada correctamente', 'success');
                }
            } catch (error) {
                console.error('Error al actualizar la dirección:', error);
                Swal.fire('Error', 'Hubo un problema al actualizar la dirección.', 'error');
            }
        }
    };
    
    const handleEliminarDireccion = async (_id) => {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción eliminará la dirección!",
            icon: 'warning',
            iconColor: '#ef4444',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'Cancelar'
        });
    
        if (confirmacion.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/direcciones/eliminar/${_id}`);
                // Actualizar la lista de direcciones
                setDirecciones(direcciones.filter(d => d._id !== _id)); // Cambia id por _id aquí
                if (direccionSeleccionada === _id) setDireccionSeleccionada('');
            } catch (error) {
                console.error('Error al eliminar la dirección:', error);
                Swal.fire('Error', 'Hubo un problema al eliminar la dirección.', 'error');
            }
        }
    };

    const enviarCorreoCajeros = async (pedido) => {
        try {
            // Obtener los correos y nombres de los cajeros
            const { data: cajeros } = await axios.get('http://localhost:5000/usuarios/cajeros');

            // Enviar el correo a cada cajero
            await Promise.all(cajeros.map(cajero => {
                return emailjs.send('service_ngt31qb', 'template_1wsxgoh', {
                    to_name: cajero.nombre,
                    to_correo: cajero.correo,
                    customer_name: pedido.nombre,
                    customer_email: pedido.correo,
                    customer_phone: pedido.telefono,
                    delivery_address: pedido.direccion,
                    order_date: new Date().toLocaleDateString(),
                    products: pedido.productos.map(p => `${p.nombre} - ${parseFloat(p.precio).toFixed(3)} X ${p.cantidad}`).join(" --- "),
                    total_amount: calcularTotal(pedido.productos),
                }, 'JS01zy1f3DQ02Ojb0');
            }));
        } catch (error) {
            console.error('Error al enviar correos:', error);
        }
    };

    const handleConfirmar = async () => {
        if (!direccionSeleccionada.trim()) {
            setError('Por favor, selecciona una dirección.');
            return;
        }
    
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const pedido = {
                usuarioId,
                direccion: direccionSeleccionada,
                nombre,
                correo,
                telefono,
                productos: carrito.map(producto => ({
                    id: producto._id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    descripcion: producto.descripcion,
                    imagen: producto.imagen,
                    categoria: producto.categoria,
                    cantidad: producto.cantidad,
                    marca: producto.marca,
                    estado: producto.estado || 'activo',
                })),
                metodoPago,
                estadoPedido: 'pendiente',
                estado: 'activo'
            };
    
            try {
                const response = await axios.post('http://localhost:5000/pedidos', pedido);

                await enviarCorreoCajeros(pedido);
    
                // Limpiar el carrito y la dirección de entrega del localStorage
                localStorage.removeItem(`carrito_${usuarioId}`);
                localStorage.removeItem('datosCarrito');
                localStorage.removeItem('direccionEntrega');
    
                // Redirigir al usuario a la página de confirmación
                navigate('/confirmar', { state: { pedidoId: response.data._id } });
            } catch (error) {
                console.error('Error al crear el pedido:', error);
                setError('Hubo un problema al procesar tu pedido.');
            }
        }
    };
    

    const calcularTotal = (productos) => {
        return productos.reduce((total, producto) => total + (parseFloat(producto.precio) || 0) * producto.cantidad, 0).toFixed(3);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Datos de Entrega</h1>
            {carrito.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">El carrito está vacío.</p>
                    <Link to="/productos" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500">Volver a la tienda</Link>
                </div>
            ) : (
                <div>
                    
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-6">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="py-4 px-4 border-b text-sm">
                                        <div className="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-4" />
                                            <span className="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b text-sm">{producto.cantidad}</td>
                                    <td className="py-4 px-4 border-b text-sm">${parseFloat(producto.precio).toFixed(3)}</td>
                                    <td className="py-4 px-4 border-b text-sm">${(parseFloat(producto.precio) * producto.cantidad).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Direcciones de Entrega</h2>
                        {direcciones.length === 0 ? (
                            <div>
                                <p className="text-lg">No tienes direcciones registradas.</p>
                                <span className="block sm:inline"> Agrega una nueva dirección para continuar.</span>
                                <br/>
                                <button onClick={handleAgregarDireccion} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 mt-4">
                                    Agregar Dirección
                                </button>
                            </div>
                        ) : (
                            <div>
                                {direcciones.map((direccion) => (
                                    <div key={direccion._id} className="flex items-center border-b border-gray-200 py-2">
                                        <input
                                            type="radio"
                                            id={`direccion-${direccion.id}`}
                                            name="direccion"
                                            value={direccion.direccion}
                                            checked={direccionSeleccionada === direccion.direccion}
                                            onChange={(e) => setDireccionSeleccionada(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`direccion-${direccion._id}`} className="text-lg font-medium">{direccion.direccion}</label>
                                        <button
                                            onClick={() => handleEditarDireccion(direccion._id, direccion.direccion)}
                                            className="ml-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-400"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminarDireccion(direccion._id)}
                                            className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-400"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button onClick={handleAgregarDireccion} className="bg-gray-500 text-white text-sm p-2 rounded hover:bg-gray-600 mt-4">
                                    Agregar Otra Dirección
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nombre: {nombre.toUpperCase()}</p>
                        <p className="text-sm font-medium text-gray-700 mb-2">Correo Electrónico: {correo}</p>
                        <p className="text-sm font-medium text-gray-700 mb-2">Teléfono: {telefono}</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-2">Método de Pago -<strong> (EL PAGO ES CONTRAENTREGA)</strong></label>
                        <select
                            id="metodoPago"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="Nequi">Nequi</option>
                            <option value="daviplata">Daviplata</option>
                        </select>
                    </div>
                    
                    <button
                        onClick={handleConfirmar}
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
                    >
                        Confirmar Pedido
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default DatosEntrega;
