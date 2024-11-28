import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArchive } from 'react-icons/fa';
import emailjs from 'emailjs-com'; // Asegúrate de tener EmailJS configurado

const PedidosCajero = () => {
  const [pedidos, setPedidos] = useState([]);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const navigate = useNavigate();
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTotal, setFiltroTotal] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10); // Tamaño de página fijo
  const totalPages = Math.ceil(pedidos.length / pageSize);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pedidos/consulta');
        const pedidosPendientes = response.data.filter(pedido => pedido.estadoPedido === 'pendiente');
        setPedidos(pedidosPendientes);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    const fetchDomiciliarios = async () => {
      try {
        // Asegúrate de que la URL sea la correcta y que el servidor esté en funcionamiento
        const response = await axios.get('http://localhost:5000/usuarios/domiciliario?rol=domiciliario');
        setDomiciliarios(response.data);
      } catch (error) {
        console.error('Error al obtener los domiciliarios:', error);
      }
    };
  
    fetchPedidos();
    fetchDomiciliarios();
  }, []);

  const calcularTotal = (productos) => {
    return productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0).toFixed(3);
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


  const mostrarDetalles = (pedido) => {
    setPedidoSeleccionado(pedidoSeleccionado?._id === pedido._id ? null : pedido);
  };

  const asignarPedido = async (pedido) => {
    const { value: domiciliarioId } = await Swal.fire({
      title: 'Selecciona un domiciliario',
      input: 'select',
      inputOptions: domiciliarios.reduce((acc, domiciliario) => {
        acc[domiciliario._id] = domiciliario.nombre;
        return acc;
      }, {}),
      inputPlaceholder: 'Selecciona un domiciliario',
      showCancelButton: true,      
      confirmButtonText: 'Asignar',
      confirmButtonColor: 'blue',
      cancelButtonColor: 'red',
    });
  
    // Verifica si el usuario no seleccionó ningún domiciliario
    if (!domiciliarioId) {
      Swal.fire({
        title: '¡Error!',
        text: 'Debes seleccionar un domiciliario para asignar el pedido.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Sale de la función si no se selecciona un domiciliario
    }
  
    try {
      const domiciliario = domiciliarios.find(dom => dom._id === domiciliarioId);
  
      const response = await axios.put(`http://localhost:5000/pedidos/${pedido._id}`, {
        asignado: domiciliarioId, // Solo se pasa el ID del domiciliario
      });
  
      if (response.status === 200) {
        // Enviar correo al domiciliario asignado
        await enviarCorreoDomiciliario(pedido, domiciliario);
        Swal.fire('Asignado', 'El pedido ha sido asignado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al asignar domiciliario:', error);
      Swal.fire('Error', 'Hubo un error al asignar el domiciliario', 'error');
    }
  
    window.location.reload();  // Recarga la página después de asignar
  };
  


  const enviarCorreoDomiciliario = async (pedido, domiciliario) => {
    try {
      await emailjs.send('service_1bjg37j', 'template_29xgv6e', {
        to_name: domiciliario.nombre,
        to_correo: domiciliario.correo,
        customer_name: pedido.nombre,
        customer_email: pedido.correo,
        customer_phone: pedido.telefono,
        delivery_address: pedido.direccion,
        order_date: new Date(pedido.fecha).toLocaleDateString(),
        products: pedido.productos.map(p => `${p.nombre} - ${p.precio} X ${p.cantidad}`).join(" --- "),
        total_amount: calcularTotal(pedido.productos),
      }, 'fopmWs9WYBqTAX5YD');
    } catch (error) {
      console.error('Error al enviar correo al domiciliario:', error);
    }
  };

  

  return (
    <div className="container mx-auto p-4 my-16">
      <h1 className="text-3xl font-bold mb-4 text-center text-black">Gestión de Pedidos</h1>
      <p className="mb-8 text-center text-gray-600">
        En esta sección podrás encontrar toda la información de los pedidos que tiene actualmente la empresa.
      </p>
      <div className="mb-4 flex space-x-4 place-content-center">
        <button
          onClick={() => navigate('/registro-pedido-cajero')}
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
        >
          <FaPlus className="inline-block mr-2" /> Registrar Nuevo Pedido
        </button>
      </div>

      <div className="mb-4 text-center">
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

      <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg">
        <thead className="bg-green-600 border-b border-gray-200">
          <tr className="text-white">
            <th className="py-2 px-4 border-b border-gray-300 text-left">Nombre del Cliente</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Fecha</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Total</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Estado</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map(pedido => (
              <React.Fragment key={pedido._id}>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">{pedido.nombre}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatearFecha(pedido.fecha)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">${calcularTotal(pedido.productos)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{pedido.estadoPedido}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => mostrarDetalles(pedido)}
                      className={`bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 ${pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? 'bg-blue-600' : ''}`}
                    >
                      {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id ? 'Ocultar Detalles' : 'Detalles'}
                    </button>
                    <button
                      onClick={() => asignarPedido(pedido)}
                      className="ml-2 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                    >
                      {pedido.asignado ? 'Editar' : 'Asignar'}
                    </button>
                  </td>
                </tr>
                {pedidoSeleccionado && pedidoSeleccionado._id === pedido._id && (
                  <tr>
                    <td colSpan="5" className="p-4 bg-gray-100 border-b border-gray-200">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                        <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha, true)}</p>
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
                        <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(pedidoSeleccionado.productos)}</h2>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No hay pedidos pendientes.</td>
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
  );
};

export default PedidosCajero;
