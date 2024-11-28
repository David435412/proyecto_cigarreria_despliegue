import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmacionCajero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pedidoData, setPedidoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Obtener el ID del pedido desde location.state
    const pedidoId = location.state?.pedidoId;

    useEffect(() => {
        if (pedidoId) {
            // Hacer la solicitud a la API para obtener los detalles del pedido
            axios.get(`http://localhost:5000/pedidos/pedidos/confirmar/${pedidoId}`)
                .then((response) => {
                    setPedidoData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al obtener los detalles del pedido:', error);
                    setError('Hubo un problema al obtener los detalles del pedido.');
                    setLoading(false);
                });
        } else {
            setError('No se encontró el ID del pedido.');
            setLoading(false);
        }
    }, [pedidoId]);

    const pedidos = () => {
        navigate('/pedidos-cajero');
    };

    if (loading) {
        return <p>Cargando detalles del pedido...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!pedidoData) {
        return <p>No se encontraron datos del pedido. Regresa al formulario de entrega.</p>;
    }

    const {
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        metodoPago="efectivo",
        productos,
        fecha,
    } = pedidoData;

    return (
        <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full max-w-[550px] bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-[#07074D]">Confirmación de Pedido</h2>
                <p className="text-lg font-medium mb-4 text-[#07074D]">Gracias por tu compra, {nombre} {apellido}!</p>
                <div className="mb-4">
                    <h3 className="text-xl font-medium text-[#07074D]">Detalles del Pedido:</h3>
                    <p><strong>Correo Electrónico:</strong> {correo}</p>
                    <p><strong>Teléfono:</strong> {telefono}</p>
                    <p><strong>Dirección:</strong> {direccion}</p>
                    <p><strong>Método de Pago:</strong> {metodoPago}</p>
                    <p><strong>Fecha:</strong> {new Date(fecha).toLocaleString()}</p>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-medium text-[#07074D]">Productos:</h3>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="py-4 px-4 border-b">
                                        <div className="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} className="w-20 h-20 object-cover mr-4" />
                                            <span className="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b">{producto.cantidad}</td>
                                    <td className="py-4 px-4 border-b">${parseFloat(producto.precio).toFixed(3)}</td>
                                    <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 text-xl font-semibold">
                        <p><strong>Subtotal:</strong> ${productos.reduce((total, producto) => total + parseFloat(producto.precio) * producto.cantidad, 0).toFixed(3)}</p>
                    </div>
                </div>
                <button
                    onClick={pedidos}
                    className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >
                    Ir a Pedido
                </button>
            </div>
        </div>
    );
};

export default ConfirmacionCajero;
