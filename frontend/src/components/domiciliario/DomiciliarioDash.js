import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns'; // Importar la función format de date-fns
import fuera_4 from "../../assets/images/fuera_4.jpeg";
import css from "../../pages/css.css";
import emailjs from 'emailjs-com'; // Importar emailjs

const DomiciliarioDashboard = () => {
    const [userName, setUserName] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroTotal, setFiltroTotal] = useState('');

      // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10); // Tamaño de página fijo
    const totalPages = Math.ceil(pedidos.length / pageSize);


    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const userId = localStorage.getItem('userId'); // Obtener userId del localStorage

        if (storedName) {
            setUserName(storedName);
        }

        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pedidos/asignados/${userId}`);
                setPedidos(response.data);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };
        

        fetchPedidos();
    }, []);

    const calcularTotal = (productos) => {
        return productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0).toFixed(3);
    };

    const formatFecha = (fecha) => {
        return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss');
    };

    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fecha).toLocaleDateString('es-CO', options);
      };

    // Filtros
    const filteredData = pedidos.filter(pedido => {
    const matchesNombre = pedido.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase());
    const matchesFecha = filtroFecha ? formatearFecha(pedido.fecha).includes(filtroFecha) : true;
    const totalPedido = calcularTotal(pedido.productos);
    const matchesTotal = filtroTotal ? totalPedido.toString().includes(filtroTotal) : true;
        return matchesNombre && matchesFecha && matchesTotal;
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

  

    const manejarEstadoEntrega = (pedido) => {
        setPedidoAConfirmar(pedido);
        Swal.fire({
            title: 'Confirmar Entrega',
            html: `<p>¿Estás seguro de que deseas marcar el pedido de "<strong>${pedido.nombre}</strong>" como entregado?</p>
                   <p><strong>Esta acción no se puede deshacer</strong></p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#FF4D4D'
        }).then((result) => {
            if (result.isConfirmed) {
                confirmarEntrega();
            }
        });
    };

    const confirmarEntrega = async () => {
        if (!pedidoAConfirmar) {
            Swal.fire({
                title: 'Error',
                text: 'No se ha seleccionado un pedido para confirmar.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        try {
            // Actualizar el estado del pedido en el servidor
            const response = await axios.patch(`http://localhost:5000/pedidos/estadoPedido/${pedidoAConfirmar._id}`, {
                estadoPedido: 'entregado'
            });
    
            // Actualizar el estado localmente
            setPedidos(pedidos.map(pedido =>
                pedido._id === pedidoAConfirmar._id
                    ? { ...pedido, estadoPedido: 'entregado' }
                    : pedido
            ));
    
            // Limpiar selección
            setPedidoAConfirmar(null);
    
            // Mostrar alerta de éxito
            Swal.fire({
                title: 'Pedido entregado',
                text: 'El estado del pedido ha sido actualizado a "entregado".',
                icon: 'success',
                confirmButtonText: 'OK'
            });
    
            // Enviar correo de confirmación usando EmailJS
            await emailjs.send('service_vlpu06s', 'template_2lgkzzq', {
                to_correo: pedidoAConfirmar.correo,
                customer_name: pedidoAConfirmar.nombre,
                delivery_date: formatFecha(new Date()),
                products: pedidoAConfirmar.productos
                    .map(p => `${p.nombre} - ${p.precio} x ${p.cantidad}`)
                    .join(" --- "),
                total: calcularTotal(pedidoAConfirmar.productos)
            }, 'JS01zy1f3DQ02Ojb0');
    
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
    
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el estado del pedido.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    

    const mostrarDetalles = (pedido) => {
        setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? null : pedido);
    };

    return (
        <>
            <div className="bg-black text-white pb-5">
                <img
                    src={fuera_4}
                    alt="Fondo"
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">¡Bienvenido, {userName}!</h1>
                    <p className="text-xl mt-2">Este es el dashboard de domiciliarios, donde puedes realizar la entrega de los pedidos que tienes asignados</p>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Pedidos Pendientes y Entregados</h2>
                        <p className="text-gray-700">
                            Consulta y modifica el estado de los pedidos realizados por los clientes. Gestiona el campo de estado de entrega para asegurar un seguimiento adecuado.
                        </p>


                        <div className="my-5  text-center">
                            <input
                            type="text"
                            placeholder="Buscar por nombre"
                            className="p-2 border border-gray-400 rounded"
                            value={filtroBusqueda}
                            onChange={(e) => setFiltroBusqueda(e.target.value)} />
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


                        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg mt-4">
                            <thead className="bg-green-600 border-b border-gray-200">
                                <tr className="text-white">
                                    <th className="py-2 px-4 border-b">Nombre del Cliente</th>
                                    <th className="py-2 px-4 border-b">Fecha</th>
                                    <th className="py-2 px-4 border-b">Total</th>
                                    <th className="py-2 px-4 border-b">Estado</th>
                                    <th className="py-2 px-4 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map(pedido => (
                                        <React.Fragment key={pedido._id}>
                                            <tr>
                                                <td className="py-2 px-4 border-b">{pedido.nombre}</td>
                                                <td className="py-2 px-4 border-b border-gray-200">{formatearFecha(pedido.fecha)}</td>
                                                <td className="py-2 px-4 border-b">${calcularTotal(pedido.productos)}</td>
                                                <td className="py-2 px-4 border-b">{pedido.estadoPedido}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {pedido.estadoPedido === 'pendiente' && (
                                                        <button
                                                            onClick={() => manejarEstadoEntrega(pedido)}
                                                            className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                                                        >
                                                            <FaCheckCircle className="inline-block mr-1" /> Marcar Entregado
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => mostrarDetalles(pedido)}
                                                        className={`ml-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-blue-600' : ''}`}
                                                    >
                                                        {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? 'Ocultar Detalles' : 'Detalles'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id && (
                                                <tr>
                                                    <td colSpan="5" className="bg-gray-100 p-4 border-b">
                                                        <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                                                        <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
                                                        <p><strong>Correo Electrónico:</strong> {pedidoSeleccionado.correo}</p>
                                                        <p><strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha, true)}</p>
                                                        <p><strong>Dirección de Entrega:</strong> {pedidoSeleccionado.direccion}</p>
                                                        <p><strong>Estado:</strong> {pedidoSeleccionado.estadoPedido}</p>
                                                        <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                                        <ul>
                                                            {pedidoSeleccionado.productos.map((producto, index) => (
                                                                <li key={index} className="flex items-center mb-2">
                                                                    {producto.imagen && (
                                                                        <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                                    )}
                                                                    <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p><strong>Total:</strong> ${calcularTotal(pedidoSeleccionado.productos)}</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-600">No hay pedidos asignados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

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
                </div>
            </div>
        </>
    );
};

export default DomiciliarioDashboard;
