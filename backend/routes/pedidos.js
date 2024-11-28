const express = require('express');
const Pedido = require('../models/Pedido'); // Aquí se importa el modelo de Pedido
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');  // O la ruta correcta a tu modelo de Usuario

const router = express.Router();

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
        // Destructuración de los datos recibidos desde el cuerpo de la solicitud
        const { usuarioId, direccion, nombre, correo, telefono, productos, metodoPago, asignado, estadoPedido = 'pendiente', estado = 'activo' } = req.body;

        // Crear el objeto de pedido
        const nuevoPedido = new Pedido({
            usuarioId,
            direccion,
            nombre,
            correo,
            telefono,
            productos,  // Esto es un arreglo de productos que tiene subdocumentos
            metodoPago,
            asignado,
            estadoPedido,
            estado
        });

        // Guardar el pedido en la base de datos
        const pedidoGuardado = await nuevoPedido.save();

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

        // Enviar la respuesta con el pedido guardado
        res.status(201).json(pedidoGuardado);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Hubo un problema al procesar tu pedido.' });
    }
});

// Ruta para obtener los detalles de un pedido por su _id
router.get('/pedidos/confirmar/:_id', async (req, res) => {
    const { _id } = req.params;



    try {
        const pedido = await Pedido.findById(_id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});


//ruta para obtener los pedidos por usuarioId
router.get('/pedidos', async (req, res) => {
    const { usuarioId } = req.query; // Obtienes el usuarioId de los query parameters


    try {
        // Buscar los pedidos usando el usuarioId tal cual como un string
        const pedidos = await Pedido.find({ usuarioId });

        // Si no se encuentran pedidos
        if (pedidos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario.' });
        }

        // Devolver los pedidos encontrados
        return res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return res.status(500).json({ message: 'Hubo un error al obtener los pedidos.' });
    }
});

// Actualizar estado de pedido
// app.put('/pedidos/:id/estado', async (req, res) => {
//     const { id } = req.params;
//     const { estadoPedido } = req.body;

//     try {
//         const pedidoActualizado = await Pedido.findByIdAndUpdate(
//             id,
//             { estadoPedido },
//             { new: true }
//         );
//         res.json(pedidoActualizado);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
//     }
// });

// Nueva ruta para obtener todos los pedidos
router.get('/consulta', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
});

router.put('/:_id/cancelar', async (req, res) => {
    const pedidoId = req.params._id;

    try {
        // Buscar el pedido
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Revertir las cantidades de los productos
        await Promise.all(pedido.productos.map(async (producto) => {
            const productoActual = await Producto.findById(producto.id); // Cambié `producto.id` por `producto._id`
            if (!productoActual) {
                throw new Error(`Producto con ID ${producto.id} no encontrado`);
            }

            const nuevaCantidad = productoActual.cantidad + producto.cantidad;
            await Producto.findByIdAndUpdate(producto.id, { cantidad: nuevaCantidad }); // Cambié `producto.id` por `producto._id`
        }));

        // Actualizar el estado del pedido
        pedido.estadoPedido = 'cancelado';
        pedido.estado = 'inactivo';
        await pedido.save();

        res.status(200).json({ message: 'Pedido cancelado exitosamente' });
    } catch (error) {
        console.error('Error al cancelar el pedido:', error.message);
        res.status(500).json({ message: 'Error al cancelar el pedido' });
    }
});

// Ruta para actualizar el estado de un pedido (asignar domiciliario)// Ruta para actualizar el estado de un pedido (asignar domiciliario)
router.put('/:_id', async (req, res) => {
    try {
      const { _id } = req.params;  // ID del pedido
      const { asignado } = req.body;  // ID del domiciliario (Usuario)
  
      // Verificamos que el usuario asignado sea un domiciliario
      const usuario = await Usuario.findById(asignado);
  
      if (!usuario || usuario.rol !== 'domiciliario') {
        return res.status(400).send('El usuario asignado no es un domiciliario válido');
      }
  
      // Actualizamos el pedido con el domiciliario asignado
      const pedido = await Pedido.findByIdAndUpdate(
        _id, 
        { asignado },  // Asignamos el ID del domiciliario
        { new: true }   // Devolvemos el pedido actualizado
      );
  
      if (!pedido) {
        return res.status(404).send('Pedido no encontrado');
      }
  
      res.json(pedido);  // Respondemos con el pedido actualizado
    } catch (error) {
      console.error('Error al asignar domiciliario:', error);
      res.status(500).send('Error al asignar domiciliario');
    }
  });

  // Ruta para obtener pedidos asignados a un usuario específico
router.get('/asignados/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const pedidos = await Pedido.find({ asignado: userId });
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
});

// Ruta para actualizar el estado del pedido
router.patch('/estadoPedido/:_id', async (req, res) => {
    const { _id } = req.params;
    const { estadoPedido } = req.body;

    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            _id,
            { estadoPedido },
            { new: true } // Devuelve el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json(pedidoActualizado);
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
});
  
  



module.exports = router;
