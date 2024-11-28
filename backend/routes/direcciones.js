const express = require('express');
const router = express.Router();
const Direccion = require('../models/Direccion');

// Ruta para agregar una nueva dirección
router.post('/', async (req, res) => {
    try {
        const { usuarioId, direccion } = req.body;

        // Verificar que el usuarioId y la dirección no estén vacíos
        if (!usuarioId || !direccion) {
            return res.status(400).json({ message: 'El usuarioId y la dirección son requeridos' });
        }

        // Crear una nueva dirección
        const nuevaDireccion = new Direccion({
            usuarioId,
            direccion
        });

        await nuevaDireccion.save();

        // Enviar la nueva dirección como respuesta
        res.status(201).json(nuevaDireccion);
    } catch (error) {
        console.error('Error al agregar la dirección:', error);
        res.status(500).json({ message: 'Hubo un problema al agregar la dirección' });
    }
});

// Ruta para obtener las direcciones de un usuario
router.get('/consulta', async (req, res) => {
    try {
        const { usuarioId } = req.query;

        // Verificar que el usuarioId esté presente
        if (!usuarioId) {
            return res.status(400).json({ message: 'El usuarioId es requerido' });
        }

        // Buscar direcciones por usuarioId
        const direcciones = await Direccion.find({ usuarioId });

        // Enviar las direcciones como respuesta
        res.status(200).json(direcciones);
    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
        res.status(500).json({ message: 'Hubo un problema al obtener las direcciones' });
    }
});

// Ruta para editar una dirección
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el id de la dirección de la URL
        const { direccion, usuarioId } = req.body; // Obtiene la nueva dirección y el usuarioId del cuerpo de la solicitud

        // Verificar que los datos necesarios estén presentes
        if (!direccion || !usuarioId) {
            return res.status(400).json({ message: 'Dirección y usuarioId son requeridos' });
        }

        // Actualizar la dirección en la base de datos
        const direccionActualizada = await Direccion.findByIdAndUpdate(id, { direccion }, { new: true });

        if (!direccionActualizada) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }

        // Devolver la dirección actualizada
        res.status(200).json(direccionActualizada);
    } catch (error) {
        console.error('Error al actualizar la dirección:', error);
        res.status(500).json({ message: 'Hubo un problema al actualizar la dirección' });
    }
});


// Ruta para eliminar una dirección
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el id de la dirección de la URL

        // Eliminar la dirección en la base de datos
        const direccionEliminada = await Direccion.findByIdAndDelete(id);

        if (!direccionEliminada) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }

        // Devolver un mensaje de éxito
        res.status(200).json({ message: 'Dirección eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la dirección:', error);
        res.status(500).json({ message: 'Hubo un problema al eliminar la dirección' });
    }
});

module.exports = router;
