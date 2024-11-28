import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ConfirmacionVenta = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productosSeleccionados } = location.state || {};

    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [estado, setEstado] = useState('activo'); 
    const [error, setError] = useState(null);

    const total = productosSeleccionados.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalConTresDecimales = total.toFixed(3);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!numeroDocumento || !metodoPago) {
            setError('Todos los campos son obligatorios.');
            return;
        }
    
        const fechaVentaStr = new Date().toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    
        // Generación del idVenta de forma única (podría ser un UUID o similar)
    
        const venta = {
            productos: productosSeleccionados.map(producto => ({
                id: producto._id,  // ID del producto
                nombre: producto.nombre,
                precio: parseFloat(producto.precio.replace(',', '')),
                cantidad: producto.cantidad,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                categoria: producto.categoria,
                marca: producto.marca,
                estado: producto.estado
            })),
            numeroDocumento,
            total,
            fechaVenta: fechaVentaStr,
            metodoPago,
            estado 
        };
    
        console.log('Productos a registrar:', venta.productos);
    
        try {
            // Registrar la venta con el idVenta
            await axios.post('http://localhost:5000/ventas', venta);
    
            localStorage.removeItem('productosSeleccionados');
    
            Swal.fire({
                title: 'Éxito',
                text: 'La venta se registró correctamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate('/ventas-cajero');
            });
        } catch (error) {
            setError(`Error al registrar la venta: ${error.message}`);
            console.error('Error al registrar la venta', error.response ? error.response.data : error.message);
        }
    };
    

    const handleAddMoreProducts = () => {
        navigate(-1);  // Volver a la página anterior sin recargar
    };

    return (
        <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full max-w-[800px] bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-[#07074D]">Confirmación de Venta</h2>
                <p className="text-lg font-medium mb-4 text-[#07074D]">
                    A continuación se muestran los detalles de la venta. Completa el formulario para registrar la venta.
                </p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Detalles de la Venta */}
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
                            {productosSeleccionados.map(producto => (
                                <tr key={producto._id}>
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
                        <p><strong>Total Venta:</strong> ${totalConTresDecimales}</p>
                    </div>
                </div>

                {/* Formulario para Datos de Venta */}
                <form onSubmit={handleSubmit} className="mb-8">                    

                    <div className="mb-4">
                        <label htmlFor="numeroDocumento" className="block text-sm font-medium mb-1">Número de Documento:</label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            value={numeroDocumento}
                            onChange={(e) => setNumeroDocumento(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                            placeholder='Digite su numero de documento'
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="metodoPago" className="block text-sm font-medium mb-1">Método de Pago:</label>
                        <select
                            id="metodoPago"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                            <option value="Nequi">Nequi</option>
                            <option value="Daviplata">Daviplata</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
                    >
                        Confirmar Venta
                    </button>

                    <button
                        type="button"
                        onClick={handleAddMoreProducts}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Agregar Más Productos
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmacionVenta;
