// backend/routes/ventas.js
const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

// Ruta para registrar una venta
router.post('/', async (req, res) => {
    const { productos, numeroDocumento, total, fechaVenta, metodoPago, estado } = req.body;

    try {
        // Crear una nueva venta
        const nuevaVenta = new Venta({
            productos,
            numeroDocumento,
            total,
            fechaVenta,
            metodoPago,
            estado
        });

        // Guardar la venta en la base de datos
        await nuevaVenta.save();

        // Actualizar la cantidad de productos en inventario
        await Promise.all(productos.map(async (producto) => {

            const productoActual = await Producto.findOne({ _id: producto.id });

            if (!productoActual) {
                throw new Error(`El producto ${producto.nombre} no existe.`);
            }

            const nuevaCantidad = productoActual.cantidad - producto.cantidad;

            if (nuevaCantidad < 0) {
                throw new Error(`No hay suficiente stock para el producto ${producto.nombre}`);
            }

            // Actualizar el producto en la base de datos
            await Producto.findByIdAndUpdate(producto.id, { $set: { cantidad: nuevaCantidad } });
        }));

        res.status(201).json({ message: 'Venta registrada correctamente' });
    } catch (error) {
        console.error(error);  // Para ver el detalle del error
        res.status(500).json({ message: error.message });
    }
});




// Obtener todas las ventas
router.get('/consulta', async (req, res) => {
    try {
        const ventas = await Venta.find();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
});

// Actualizar el estado de una venta (por ejemplo, de activo a inactivo)
router.put('/:id', async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });

        venta.estado = req.body.estado;
        await venta.save();
        res.json({ message: 'Estado de la venta actualizado', venta });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la venta', error });
    }
});

router.put('/:_id/inactivar', async (req, res) => {
    const ventaId = req.params._id;
    const { productos } = req.body;

    try {
        // Buscar la venta
        const venta = await Venta.findById(ventaId);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Devolver la cantidad de los productos al inventario
        await Promise.all(productos.map(async (producto) => {
            const productoActual = await Producto.findById(producto.id); // Usar _id en lugar de id
            if (!productoActual) {
                throw new Error(`Producto con ID ${producto.id} no encontrado`);
            }

            const nuevaCantidad = productoActual.cantidad + producto.cantidad;
            await Producto.findByIdAndUpdate(producto.id, { cantidad: nuevaCantidad });
        }));

        // Cambiar el estado de la venta a 'inactivo'
        venta.estado = 'inactivo';
        await venta.save();

        res.status(200).json({ message: 'Venta inactivada y stock actualizado' });
    } catch (error) {
        console.error('Error al inactivar la venta:', error.message);
        res.status(500).json({ message: 'Hubo un error al intentar inactivar la venta' });
    }
});

module.exports = router;
