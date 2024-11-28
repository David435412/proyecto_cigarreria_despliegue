import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTable, useFilters, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPlus, FaArchive } from 'react-icons/fa';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [filteredVentas, setFilteredVentas] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [mostrarInactivas, setMostrarInactivas] = useState(false);
    const navigate = useNavigate();

    const fetchVentas = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/ventas/consulta');
            setVentas(response.data);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    }, []);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    useEffect(() => {
        const filtered = ventas.filter(venta => {
            const fechaBuscada = '2024-10-20'; // Cambia esto al formato correspondiente si es necesario
            return (
                (mostrarInactivas ? venta.estado === 'inactivo' : venta.estado === 'activo') &&
                (venta.numeroDocumento.toLowerCase().includes(filterInput.toLowerCase()) ||
                venta.fechaVenta === fechaBuscada ||
                venta.fechaVenta.toLowerCase().includes(filterInput.toLowerCase()))
            );
        });
        setFilteredVentas(filtered);
    }, [filterInput, ventas, mostrarInactivas]);

    const handleFilterChange = e => {
        setFilterInput(e.target.value || '');
    };

    const calcularTotal = (productos) => {
        const total = productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0);
        return total.toFixed(3);
    };

    const manejarEliminarVenta = async (venta) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Cambiar el estado de esta venta a inactivo no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, inactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Llamada a la ruta del backend para inactivar la venta y actualizar el stock
                    await axios.put(`http://localhost:5000/ventas/${venta._id}/inactivar`, {
                        productos: venta.productos
                    });
    
                    // Actualizar la lista de ventas
                    fetchVentas();
    
                    Swal.fire(
                        '¡Venta inactivada!',
                        'La venta ha sido cambiada a estado inactivo.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al inactivar la venta:', error);
                    Swal.fire(
                        'Error',
                        'Hubo un error al intentar inactivar la venta.',
                        'error'
                    );
                }
            }
        });
    };
    
    const ColumnFilter = ({
        column: { filterValue, preFilteredRows, setFilter },
    }) => {
        const count = preFilteredRows.length;
        return (
            <input
                value={filterValue || ''}
                onChange={e => setFilter(e.target.value || undefined)}
                placeholder={`Buscar ${count} registros...`}
                className="border p-1 rounded"
            />
        );
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada._id === venta._id ? null : venta);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Número Documento',
                accessor: 'numeroDocumento',
                Filter: ColumnFilter,
            },
            {
                Header: 'Fecha Venta',
                accessor: 'fechaVenta',
                Filter: ColumnFilter,
            },
            {
                Header: 'Total',
                accessor: row => `$${calcularTotal(row.productos)}`,
                id: 'total',
                Filter: ColumnFilter,
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <div className="flex space-x-2 justify-center">
                        {row.original.estado === 'activo' ? (
                            <>
                                <button
                                    onClick={() => mostrarDetalles(row.original)}
                                    className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${ventaSeleccionada && ventaSeleccionada.id === row.original.id ? 'bg-blue-600' : ''}`}
                                >
                                    {ventaSeleccionada && ventaSeleccionada._id === row.original._id ? 'Ocultar Detalles' : 'Detalles'}
                                </button>
                                <button
                                    onClick={() => manejarEliminarVenta(row.original)}
                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                >
                                    Inactivar
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => mostrarDetalles(row.original)}
                                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                            >
                                Detalles
                            </button>
                        )}
                    </div>
                )
            }
        ],
        [ventaSeleccionada, mostrarInactivas]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex },
        gotoPage,
        canPreviousPage,
        previousPage,
        canNextPage,
        nextPage,
        pageOptions,
        setFilter,
    } = useTable(
        {
            columns,
            data: filteredVentas,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        usePagination
    );

    return (
        <div className="container mx-auto px-4 my-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Ventas</h1>
            <p className="mb-4 text-center">Aquí puedes gestionar las ventas registradas en el sistema. Puedes ver detalles de cada venta, así como inactivar ventas si es necesario.</p>
            <div className="mb-4 flex space-x-4 place-content-center">
                <button
                    onClick={() => navigate('/registro-venta')}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nueva Venta
                </button>
                <button
                    onClick={() => setMostrarInactivas(!mostrarInactivas)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> {mostrarInactivas ? 'Mostrar Activas' : 'Mostrar Inactivas'}
                </button>
            </div>

            <div className="overflow-x-auto">
            <table {...getTableProps()} className="w-full border-collapse border border-gray-300 mx-auto">
                    <thead>
                        {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="bg-green-600">
                            {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className="border p-2 text-white text-center">
                                <div className="flex flex-col items-center">
                                {column.render('Header')}
                                {column.canFilter ? column.render('Filter') : null}
                                </div>
                            </th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <React.Fragment key={row._id}>
                                    <tr {...row.getRowProps()} className="bg-white hover:bg-gray-100">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} className="border p-2 text-black text-center">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                    {ventaSeleccionada && ventaSeleccionada._id === row.original._id && (
                                        <tr>
                                            <td colSpan="5" className="py-4 px-4 border-b bg-gray-100">
                                                <div>
                                                    <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                                                    <p><strong>Número Documento:</strong> {ventaSeleccionada.numeroDocumento}</p>
                                                    <p><strong>Fecha Venta:</strong> {ventaSeleccionada.fechaVenta}</p>
                                                    <p><strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago}</p>
                                                    <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                                    <ul>
                                                        {ventaSeleccionada.productos.map((producto, index) => (
                                                            <li key={index} className="flex items-center mb-2">
                                                                {producto.imagen && (
                                                                    <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-4" />
                                                                )}
                                                                <span>{producto.nombre} - {producto.cantidad} x ${parseFloat(producto.precio).toFixed(3)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <p><strong>Total:</strong> ${calcularTotal(ventaSeleccionada.productos)}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                    {'<'}
                </button>
                <span>
                    Página{' '}
                    <strong>
                        {pageIndex + 1} de {pageOptions.length}
                    </strong>{' '}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                    {'>>'}
                </button>
            </div>
        </div>
    );
}

export default GestionVentas;
