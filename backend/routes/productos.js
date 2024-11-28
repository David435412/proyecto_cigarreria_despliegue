const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Crear un producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto registrado con éxito', producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el producto', error });
    }
});

// Obtener todos los productos
router.get('/consulta', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Obtener producto por ID
router.get('/consulta/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

// Actualizar estado del producto
router.put('/estado/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

router.put('/stock/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    try {
        // Buscar el producto por su ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar la cantidad del producto sin restricción
        producto.cantidad += cantidad;

        // Guardar el producto actualizado
        await producto.save();

        return res.status(200).json({
            message: `Stock actualizado con éxito. Nueva cantidad: ${producto.cantidad}`,
            producto
        });
    } catch (error) {
        console.error('Error al actualizar el stock:', error);
        return res.status(500).json({ message: 'Error al actualizar el stock', error });
    }
});


// Actualizar datos completos del producto por ID
router.put('/actualizar/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new devuelve el producto actualizado, runValidators aplica las validaciones del modelo.
        );
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado con éxito', producto });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

module.exports = router;
