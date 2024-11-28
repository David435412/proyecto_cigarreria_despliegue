import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); // Estado para el pedido seleccionado
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal de confirmación de cancelación
    const [pedidoACancelar, setPedidoACancelar] = useState(null); // Estado para el pedido a cancelar
    const [filtroFecha, setFiltroFecha] = useState(''); // Estado para el filtro de fecha
    const [filtroTotal, setFiltroTotal] = useState(''); // Estado para el filtro de total

    // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10); // Tamaño de página fijo
    const totalPages = Math.ceil(pedidos.length / pageSize);

    useEffect(() => {
        const usuarioId = localStorage.getItem('userId');
        console.log('usuarioId:', usuarioId);

        if (usuarioId) {
            axios.get(`http://localhost:5000/pedidos/pedidos?usuarioId=${usuarioId}`)
            .then((response) => {
                    console.log(response.data); // Verifica los datos que recibes
                    setPedidos(response.data); // Guardar los pedidos en el estado
                })
                .catch((error) => {
                    console.error(error);
                    setError('Hubo un problema al obtener los pedidos.');
                });
        } else {
            setError('No se encontró el ID del usuario en localStorage.');
        }
    }, []);

    const calcularTotal = (productos) => {
        const total = productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
        return total.toFixed(3);
    };

    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fecha).toLocaleDateString('es-CO', options);
      };
    
     // Filtros
    const filteredData = pedidos.filter(pedido => {
    const matchesFecha = filtroFecha ? formatearFecha(pedido.fecha).includes(filtroFecha) : true;
    const totalPedido = calcularTotal(pedido.productos);
    const matchesTotal = filtroTotal ? totalPedido.toString().includes(filtroTotal) : true;
        return matchesFecha && matchesTotal;
    });

     // Datos paginados
    const paginatedData = filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Funciones de paginación
    const nextPage = () => {
        if (currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
        }
    };
    
    const previousPage = () => {
        if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
        }
    };
    
    const firstPage = () => {
        setCurrentPage(0);
    };
    
    const lastPage = () => {
        setCurrentPage(totalPages - 1);
    };


    const mostrarDetalles = (pedido) => {
        setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? null : pedido);
    };

    const manejarCancelarPedido = (pedido) => {
        setPedidoACancelar(pedido);
        setMostrarModal(true);
    };

    const cancelarPedido = async () => {
        try {
            // Cambiar el estado del pedido a "cancelado" desde el backend
            await axios.put(`http://localhost:5000/pedidos/${pedidoACancelar._id}/cancelar`);
    
            // Actualizar la lista de pedidos localmente
            setPedidos(pedidos.map(pedido => 
                pedido._id === pedidoACancelar._id 
                    ? { ...pedido, estadoPedido: 'cancelado', estado: 'inactivo' } 
                    : pedido
            ));
            
            // Limpiar el modal
            setMostrarModal(false);
            setPedidoACancelar(null);
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
        }
    };
    
    

    const cancelarConfirmacion = () => {
        setMostrarModal(false);
        setPedidoACancelar(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 my-5">
            <h1 className="text-3xl font-semibold mb-6">Mis Pedidos</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 text-center">
                <input
                    type="text"
                    placeholder="Fecha"
                    className="p-2 border border-gray-400 rounded ml-2"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)} />
                <input
                    type="text"
                    placeholder="Buscar por total"
                    className="p-2 border border-gray-400 rounded ml-2"
                    value={filtroTotal}
                    onChange={(e) => setFiltroTotal(e.target.value)} />
            </div>

            {pedidos.length === 0 ? (
                <p className="text-center text-xl">No tienes pedidos realizados aún.</p>
            ) : (
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-green-600">
                        <tr>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Fecha</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Total</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Estado</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map(pedido => (
                            <React.Fragment key={pedido._id}>
                                <tr>
                                    <td className="py-2 px-4 border-b text-center border-gray-200">{formatearFecha(pedido.fecha)}</td>
                                    <td className="py-4 px-4 border-b text-center">${calcularTotal(pedido.productos)}</td>
                                    <td className="py-4 px-4 border-b text-center">{pedido.estadoPedido}</td>
                                    <td className="py-4 px-4 border-b text-center">
                                        <button
                                            onClick={() => mostrarDetalles(pedido)}
                                            className={`bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-indigo-700' : ''}`}
                                        >
                                            {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                        </button>
                                    </td>
                                </tr>
                                {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id && (
                                    <tr>
                                        <td colSpan="4" className="py-4 px-4 border-b bg-gray-100">
                                            <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                                            <p><strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha, true)}</p>
                                            <p><strong>Estado:</strong> {pedidoSeleccionado.estadoPedido}</p>
                                            <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                            <ul>
                                                {pedidoSeleccionado.productos.map((producto, index) => (
                                                    <li key={index} className="flex items-center mb-2">
                                                        {producto.imagen && (
                                                            <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                        )}
                                                        <p>{producto.nombre} - ${producto.precio} x {producto.cantidad} = ${(producto.precio * producto.cantidad).toFixed(3)}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(pedidoSeleccionado.productos)}</h2>
                                            
                                            {pedido.estadoPedido === 'pendiente' && (
                                                <button
                                                    onClick={() => manejarCancelarPedido(pedido)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 my-2"
                                                >
                                                    Cancelar Pedido
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ):(
                        <tr>
                            <td colSpan="5" className="text-center py-4">No hay pedidos pendientes.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirmación</h2>
                        <p>¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={cancelarConfirmacion}
                                className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cancelarPedido}
                                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <button onClick={firstPage} disabled={currentPage === 0} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {'<<'}
                </button>
                <button onClick={previousPage} disabled={currentPage === 0} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {'<'}
                </button>
                <span className="px-4 py-2">Página {currentPage + 1} de {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages - 1} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {'>'}
                </button>
                <button onClick={lastPage} disabled={currentPage === totalPages - 1} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {'>>'}
                </button>
            </div>
        </div>
    );
};

export default Pedidos;
