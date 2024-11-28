import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const VentasInactivas = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Obtener las ventas inactivas desde la API
    const fetchVentasInactivas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/ventas');
            const ventasInactivas = response.data.filter(venta => venta.estado === 'inactivo');
            setVentas(ventasInactivas);
        } catch (error) {
            console.error('Error al obtener las ventas inactivas', error);
            setError('No se pudieron cargar las ventas inactivas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentasInactivas();
    }, []);

    const handleActivate = async (venta) => {
        try {
            await axios.put(`http://localhost:5000/ventas/${venta.id}`, { ...venta, estado: 'activo' });

            // Actualizar el inventario de productos
            await Promise.all(venta.productos.map(async (producto) => {
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);
                const nuevaCantidad = productoActual.cantidad - producto.cantidad;
                await axios.put(`http://localhost:5000/productos/${producto.id}`, {
                    ...productoActual,
                    cantidad: nuevaCantidad
                });
            }));

            fetchVentasInactivas();
            Swal.fire('Éxito', 'Venta activada exitosamente.', 'success');
        } catch (error) {
            console.error('Error al activar la venta', error);
            Swal.fire('Error', 'No se pudo activar la venta.', 'error');
        }
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

    // Mostrar la confirmación usando SweetAlert2
    const confirmActivate = (venta) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción activará la venta seleccionada.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleActivate(venta);
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Ventas Inactivas</h1>
            <p className="mb-8">
                En esta sección podrás gestionar las ventas inactivas del sistema. Puedes visualizar las ventas que están inactivas y activarlas si es necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/gestion-ventas')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaUsers className="inline-block mr-2" /> Volver a Gestión de Ventas
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-green-600 text-white border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left">Número de Documento</th>
                            <th className="p-4 text-left">Fecha de Venta</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">Cargando...</td>
                            </tr>
                        ) : ventas.length > 0 ? (
                            ventas.map((venta) => (
                                <React.Fragment key={venta.id}>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-4">{venta.numeroDocumento}</td>
                                        <td className="p-4">{venta.fechaVenta}</td>
                                        <td className="p-4">${venta.total.toFixed(3)}</td>
                                        <td className="p-4 flex gap-1">
                                            <button
                                                onClick={() => confirmActivate(venta)}
                                                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                                            >
                                                Activar
                                            </button>
                                            <button
                                                onClick={() => mostrarDetalles(venta)}
                                                className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'bg-blue-600' : ''}`}
                                            >
                                                {ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                                            </button>
                                        </td>
                                    </tr>
                                    {ventaSeleccionada && ventaSeleccionada.id === venta.id && (
                                        <tr>
                                            <td colSpan="4" className="p-4 bg-gray-100">
                                                <div>
                                                    <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                                                    <p><strong>Número Documento:</strong> {venta.numeroDocumento}</p>
                                                    <p><strong>Fecha Venta:</strong> {venta.fechaVenta}</p>
                                                    <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                                    <ul>
                                                        {venta.productos.map((producto, index) => (
                                                            <li key={index} className="flex items-center mb-2">
                                                                {producto.imagen && (
                                                                    <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                                )}
                                                                <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <h2 className="text-xl font-semibold mt-2">Subtotal: ${venta.productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0).toFixed(3)}</h2>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No hay ventas inactivas en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VentasInactivas;
