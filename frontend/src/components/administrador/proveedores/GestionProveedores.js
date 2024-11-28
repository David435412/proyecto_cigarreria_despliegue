import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTable, useFilters, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaArchive, FaUndo } from 'react-icons/fa';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchProveedores = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/proveedores/consulta');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener los proveedores', error);
            setError('No se pudieron cargar los proveedores.');
        }
    }, []);

    useEffect(() => {
        fetchProveedores();
    }, [fetchProveedores]);

    useEffect(() => {
        const filtered = proveedores.filter(proveedor =>
            (mostrarInactivos ? proveedor.estado === 'inactivo' : proveedor.estado === 'activo') &&
            (proveedor.nombre.toLowerCase().includes(filterInput.toLowerCase()) ||
            proveedor.telefono.toLowerCase().includes(filterInput.toLowerCase()) ||
            proveedor.correo.toLowerCase().includes(filterInput.toLowerCase()))
        );
        setFilteredProveedores(filtered);
    }, [filterInput, proveedores, mostrarInactivos]);

    const handleFilterChange = e => {
        setFilterInput(e.target.value || '');
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nombre',
                accessor: 'nombre',
                Filter: ColumnFilter,
            },
            {
                Header: 'Teléfono',
                accessor: 'telefono',
                Filter: ColumnFilter,
            },
            {
                Header: 'Correo',
                accessor: 'correo',
                Filter: ColumnFilter,
            },
            {
                Header: 'Estado',
                accessor: 'estado',
                Filter: ColumnFilter,
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <div className="flex space-x-2 justify-center">
                        {!mostrarInactivos && (
                            <button
                                onClick={() => navigate(`/editar-proveedor/${row.original._id}`)}
                                className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                            >
                                <FaEdit className="inline-block mr-1" /> Editar
                            </button>
                        )}
                        {mostrarInactivos ? (
                            <button
                                onClick={() => handleActivar(row.original)}
                                className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                            >
                                <FaUndo className="inline-block mr-1" /> Activar
                            </button>
                        ) : (
                            <button
                                onClick={() => handleInactivar(row.original)}
                                className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                            >
                                <FaArchive className="inline-block mr-1" /> Inactivar
                            </button>
                        )}
                    </div>
                )
            }
        ],
        [navigate, mostrarInactivos]
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
            data: filteredProveedores,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        usePagination
    );

    const handleInactivar = async (proveedor) => {
        Swal.fire({
            title: 'Confirmar Inactivación',
            text: `¿Estás seguro de que quieres inactivar el proveedor "${proveedor.nombre}"?`,
            icon: 'warning',
            iconColor: 'red',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Inactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/proveedores/${proveedor._id}`, {...proveedor,   estado: 'inactivo'});
                    fetchProveedores();
                    Swal.fire('Inactivado', 'El proveedor ha sido inactivado.', 'success');
                } catch (error) {
                    console.error('Error al inactivar el proveedor', error);
                    setError('No se pudo inactivar el proveedor.');
                }
            }
        });
    };

    const handleActivar = async (proveedor) => {
        Swal.fire({
            title: 'Confirmar Activación',
            text: `¿Estás seguro de que quieres activar el proveedor "${proveedor.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/proveedores/${proveedor._id}`, {
                        estado: 'activo'
                    });
                    fetchProveedores();
                    Swal.fire('Activado', 'El proveedor ha sido activado.', 'success');
                } catch (error) {
                    console.error('Error al activar el proveedor', error);
                    setError('No se pudo activar el proveedor.');
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Proveedores</h1>
            <p className="mb-8 text-center text-gray-600">
                En esta sección podrás gestionar los proveedores del sistema. Puedes registrar nuevos proveedores,
                visualizar los proveedores que ya has registrado y eliminarlos según sea necesario.
            </p>

            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <div className="mb-4 flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/registro-proveedor')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nuevo Proveedor
                </button>
                <button
                    onClick={() => setMostrarInactivos(!mostrarInactivos)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700"
                >
                    <FaArchive className="inline-block mr-2" /> {mostrarInactivos ? 'Mostrar Activos' : 'Mostrar Inactivos'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table {...getTableProps()} className="w-full border-collapse border border-gray-300 mx-auto">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="bg-green-600">
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className="border p-2 text-white text-center">
                                        {column.render('Header')}
                                        {column.canFilter ? column.render('Filter') : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="bg-white hover:bg-gray-100">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="border p-2 text-black text-center">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'<'}
                </button>
                <span className="text-gray-700">
                    Página {pageIndex + 1} de {pageOptions.length}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'>'}
                </button>
                <button
                    onClick={() => gotoPage(pageOptions.length - 1)}
                    disabled={!canNextPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

const ColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
    const count = preFilteredRows.length;

    return (
        <input
            type="text"
            value={filterValue || ''}
            onChange={e => setFilter(e.target.value || undefined)}
            placeholder={`Buscar (${count})`}
            className="border border-gray-300 p-1 rounded text-black"
        />
    );
};

export default GestionProveedores;
