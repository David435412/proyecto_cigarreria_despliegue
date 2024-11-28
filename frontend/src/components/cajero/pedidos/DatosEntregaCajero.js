import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';

const DatosEntregaCajero = () => {
    const [carrito, setCarrito] = useState([]);
    const [direccion, setDireccion] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos del carrito del localStorage
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const carritoData = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
            setCarrito(carritoData);
        }
    }, []);

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    };

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
    };

    const handleCorreoChange = (e) => {
        setCorreo(e.target.value);
    };

    const handleTelefonoChange = (e) => {
        setTelefono(e.target.value);
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
                    products: pedido.productos.map(p => `${p.nombre} - ${p.precio} X ${p.cantidad}`).join(" --- "),
                    total_amount: calcularTotal(pedido.productos),
                }, 'JS01zy1f3DQ02Ojb0');
            }));
        } catch (error) {
            console.error('Error al enviar correos:', error);
        }
    };

    const handleConfirmar = async () => {       
    
        if (!direccion.trim() || !nombre.trim() || !correo.trim() || !telefono.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const pedido = {
                usuarioId,
                direccion,
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
                fecha: new Date().toISOString(),
                estadoPedido: 'pendiente',
                estado: 'activo',
                metodoPago: 'efectivo',
            };                
               
            try {
                const response = await axios.post('http://localhost:5000/pedidos', pedido);

                await enviarCorreoCajeros(pedido);
    
                // Limpiar el carrito y la dirección de entrega del localStorage
                localStorage.removeItem(`carrito_${usuarioId}`);
                localStorage.removeItem('datosCarrito');
                localStorage.removeItem('direccionEntrega');
    
                // Redirigir al usuario a la página de confirmación
                navigate('/ConfirmacionCajero', { state: { pedidoId: response.data._id } });
            } catch (error) {
                console.error('Error al crear el pedido:', error);
                setError('Hubo un problema al procesar tu pedido.');
            }
        }
    };

    const calcularTotal = (productos) => {
        return productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(3);
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
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((producto) => (
                                <tr key={producto._id}>
                                    <td className="py-4 px-4 border-b">
                                        <div className="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} className="w-20 h-20 object-cover mr-4" />
                                            <span className="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b">{producto.cantidad}</td>
                                    <td className="py-4 px-4 border-b">${producto.precio}</td>
                                    <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Subtotal: ${calcularTotal(carrito)}</h2>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={handleNombreChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={handleCorreoChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa tu correo electrónico"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                        <input
                            type="text"
                            id="telefono"
                            value={telefono}
                            onChange={handleTelefonoChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa tu teléfono"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">Dirección de Entrega</label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={handleDireccionChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa tu dirección de entrega"
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <button
                        onClick={handleConfirmar}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                        >
                        Confirmar y Proceder al Pago
                    </button>
                </div>
            )}
        </div>
    );
};

export default DatosEntregaCajero;
