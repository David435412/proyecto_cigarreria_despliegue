import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useTable, useFilters, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaEyeSlash, FaArchive, FaUndo } from 'react-icons/fa';
import Swal from 'sweetalert2';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [error, setError] = useState('');
    const [showInactivos, setShowInactivos] = useState(false);
    const navigate = useNavigate();

    // Llamada a la API para obtener los usuarios desde MongoDB
    const fetchUsuarios = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios/consulta');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios', error);
            setError('No se pudieron cargar los usuarios.');
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    useEffect(() => {
        const filtered = usuarios
            .filter(usuario => usuario.rol !== 'administrador') // Excluir administradores
            .filter(usuario => {
                return showInactivos ? usuario.estado === 'inactivo' : usuario.estado === 'activo';
            })
            .filter(usuario =>
                usuario.nombre.toLowerCase().includes(filterInput.toLowerCase()) ||
                usuario.nombreUsuario.toLowerCase().includes(filterInput.toLowerCase()) ||
                usuario.numeroDocumento.includes(filterInput)
            );
        setFilteredUsuarios(filtered);
    }, [filterInput, usuarios, showInactivos]);

    const handleFilterChange = e => {
        setFilterInput(e.target.value || '');
    };

    const handleDelete = async (usuario) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas inactivar este usuario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, inactivar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/usuarios/${usuario._id}`, { ...usuario, estado: 'inactivo' });
                fetchUsuarios();
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario inactivado',
                    text: 'El usuario ha sido inactivado exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al inactivar el usuario', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo inactivar el usuario.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleReactivar = async (usuario) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas reactivar este usuario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reactivar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/usuarios/${usuario._id}`, { ...usuario, estado: 'activo' });
                fetchUsuarios(); // Recarga los usuarios después de la reactivación
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario reactivado',
                    text: 'El usuario ha sido reactivado exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al reactivar el usuario', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo reactivar el usuario.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const columns = useMemo(() => [
        {
            Header: 'Nombre',
            accessor: 'nombre',
            Filter: ColumnFilter,
        },
        {
            Header: 'Nombre de Usuario',
            accessor: 'nombreUsuario',
            Filter: ColumnFilter,
        },
        {
            Header: 'Tipo Documento',
            accessor: 'tipoDocumento',
            Filter: ColumnFilter,
        },
        {
            Header: 'Número Documento',
            accessor: 'numeroDocumento',
            Filter: ColumnFilter,
        },
        {
            Header: 'Correo',
            accessor: 'correo',
            Filter: ColumnFilter,
        },
        {
            Header: 'Teléfono',
            accessor: 'telefono',
            Filter: ColumnFilter,
        },
        {
            Header: 'Dirección',
            accessor: 'direccion',
            Filter: ColumnFilter,
        },
        {
            Header: 'Rol',
            accessor: 'rol',
            Filter: ColumnFilter,
        },
        {
            Header: 'Acciones',
            Cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    {row.original.estado === 'activo' && !showInactivos ? (
                        <button
                            onClick={() => handleDelete(row.original)}
                            className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                        >
                            <FaArchive className="inline-block mr-1" /> Inactivar
                        </button>
                    ) : (
                        <button
                            onClick={() => handleReactivar(row.original)} 
                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                        >
                            <FaUndo className="inline-block mr-1" /> Reactivar
                        </button>
                    )}
                </div>
            )
        }
    ], [showInactivos]);

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
    } = useTable(
        {
            columns,
            data: filteredUsuarios,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        usePagination
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Usuarios</h1>
            <p className="mb-8 text-center">
                En esta sección podrás gestionar a los usuarios del sistema. Puedes registrar nuevos usuarios,
                visualizar los usuarios que ya has registrado y desactivarlos según sea necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 flex space-x-4 place-content-center">
                <button
                    onClick={() => navigate('/registro-empleado')}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nuevo Usuario
                </button>
                <button
                    onClick={() => setShowInactivos(!showInactivos)}
                    className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2 ${showInactivos ? 'bg-gray-700' : ''}`}
                >
                    {showInactivos ? <FaEyeSlash className="inline-block" /> : <FaEye className="inline-block" />}
                    <span>{showInactivos ? 'Mostrar Activos' : 'Mostrar Inactivos'}</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table {...getTableProps()} className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-green-600 border-b border-gray-200">
                        {headerGroups.map(headerGroup => (
                            <React.Fragment key={headerGroup.id}>
                                <tr {...headerGroup.getHeaderGroupProps()} className="text-white">
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="p-4 text-left">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    {headerGroup.headers.map(column => (
                                        <th key={column.id} className="px-4 pb-4">
                                            {column.canFilter ? column.render('Filter') : null}
                                        </th>
                                    ))}
                                </tr>
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="border-b border-gray-200">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="p-4">
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
        <div className="flex flex-col">
            <input
                value={filterValue || ''}
                onChange={e => setFilter(e.target.value || undefined)}
                placeholder={`Buscar ${count} registros...`}
                className="w-full border p-2 rounded text-black"
            />
        </div>
    );
};

export default GestionUsuarios;
