// backend/routes/proveedores.js
const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// Ruta para registrar proveedor
router.post('/', async (req, res) => {
    try {
        const { nombre, telefono, correo, estado } = req.body;


        const nuevoProveedor = new Proveedor({
            nombre,
            telefono,
            correo,
            estado
        });

        await nuevoProveedor.save();
        res.status(201).json({ message: "Proveedor registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el Proveedor", error });
    }
});

// Obtener todos los proveedores
router.get('/consulta', async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
});

// Obtener un proveedor por ID
router.get('/consulta/:id', async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(proveedor);
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ message: 'Error al obtener el proveedor', error });
    }
});


// Actualizar otros atributos del proveedor (nombre, telefono, correo)
router.put('/actualizar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, correo } = req.body;

        // Validar que los campos necesarios estén presentes
        if (!nombre || !telefono || !correo) {
            return res.status(400).json({ message: 'Todos los campos (nombre, telefono, correo) son obligatorios' });
        }

        // Buscar y actualizar los atributos especificados
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(
            id,
            { nombre, telefono, correo },
            { new: true, runValidators: true }
        );

        if (!proveedorActualizado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.json({ message: 'Proveedor actualizado con éxito', proveedor: proveedorActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proveedor', error });
    }
});


// Actualizar estado del proveedor
router.put('/:id', async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.estado = req.body.estado;
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el proveedor' });
    }
});

module.exports = router;