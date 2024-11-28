// backend/routes/users.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');


// Ruta para registrar usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, contrasena, nombreUsuario, correo, telefono, direccion, tipoDocumento, numeroDocumento, estado, rol } = req.body;


        const nuevoUsuario = new Usuario({
            nombre,
            contrasena, 
            nombreUsuario,
            correo,
            telefono,
            direccion,
            tipoDocumento,
            numeroDocumento,
            estado,
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: "Cliente registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el cliente", error });
    }
});

// Ruta de autenticación de usuario
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ message: "Correo o contraseña incorrectos." });
        }

        // Verificar que la contraseña coincida y que el usuario esté activo
        if (usuario.contrasena === contrasena && usuario.estado === 'activo') {
            return res.status(200).json(usuario); // Devuelve los datos del usuario
        } else if (usuario.estado !== 'activo') {
            return res.status(403).json({ message: "Tu cuenta no está activa. Contacta con soporte." });
        } else {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión', error);
        res.status(500).json({ message: "Error en el servidor. Intenta nuevamente." });
    }
});

router.post('/empleados', async (req, res) => {
    try {
        const { nombre, contrasena, nombreUsuario, correo, telefono, direccion, tipoDocumento, numeroDocumento, estado, rol } = req.body;



        const nuevoEmpleado = new Usuario({
            nombre,
            contrasena, 
            nombreUsuario,
            correo,
            telefono,
            direccion,
            tipoDocumento,
            numeroDocumento,
            estado,
            rol
        });

        await nuevoEmpleado.save();
        res.status(201).json({ message: "Empleado registrado con éxito", empleado: nuevoEmpleado });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el empleado", error });
    }
});

// Obtener todos los usuarios
router.get('/consulta', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        usuario.estado = req.body.estado;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//ruta para actualizar usuario loggeado
router.put('/loggeado/:userId', async (req, res) => {
    const { userId } = req.params;
    const { correo, telefono, direccion } = req.body; // Los datos que quieres permitir actualizar

    try {
        // Buscar el usuario por su ID
        const user = await Usuario.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos que se pasen en la solicitud
        user.correo = correo || user.correo;
        user.telefono = telefono || user.telefono;
        user.direccion = direccion || user.direccion;

        // Guardar los cambios en la base de datos
        await user.save();

        return res.status(200).json({ message: 'Usuario actualizado con éxito', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// Ruta para verificar la contraseña actual
router.post('/:id/verificar-contrasena', async (req, res) => {
    const { id } = req.params;
    const { contrasenaActual } = req.body; // Contraseña encriptada enviada desde el frontend

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (usuario.contrasena === contrasenaActual) {
            return res.status(200).json({ message: 'Contraseña correcta' });
        } else {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar la contraseña', error });
    }
});

// Ruta para cambiar la contraseña
router.put('/:id/cambiar-contrasena', async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body; // Contraseña encriptada enviada desde el frontend

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.contrasena = nuevaContrasena; // Actualiza la contraseña en la base de datos
        await usuario.save();

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
});
// Ruta para guardar el código de recuperación
router.post('/recuperar-contrasena', async (req, res) => {
    const { correo, codigoRecuperacion } = req.body; // El correo y el código enviados desde el frontend

    try {
        // Buscar al usuario por correo
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        // Guardar el código de recuperación en la base de datos
        usuario.codigoRecuperacion = codigoRecuperacion;
        await usuario.save();

        // Responder con éxito
        res.status(200).json({ message: 'Código de recuperación guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el código de recuperación:', error);
        res.status(500).json({ message: 'Error al guardar el código de recuperación', error });
    }
});

// Ruta para verificar el código de recuperación
router.get('/verificar-codigo', async (req, res) => {
    const { correo, codigo } = req.query;  // Recibimos el correo y el código

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        if (usuario.codigoRecuperacion !== codigo) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }

        res.status(200).json({ message: 'Código válido' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el código' });
    }
});


const encriptarContrasena = (contrasena) => {
    return contrasena
        .split('') // Convertir la contraseña a un array de caracteres
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 3)) // Desplazar cada caracter 3 posiciones en ASCII
        .join(''); // Unir el array de caracteres en una cadena
};

// Ruta para actualizar la contraseña del usuario
// Ruta para actualizar la contraseña
router.put('/act', async (req, res) => {
    console.log("Ruta /actualizar alcanzada");


    const { correo, nuevaContrasena } = req.body; // Recibe el correo y la nueva contraseña
    console.log('Datos recibidos:', { correo, nuevaContrasena });


    if (!correo || !nuevaContrasena) {
        return res.status(400).json({ message: 'Correo y nueva contraseña son obligatorios' });
    }

    try {
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo: correo });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Encriptar la nueva contraseña con la función personalizada
        const encryptedPassword = encriptarContrasena(nuevaContrasena);

        // Actualizar la contraseña del usuario
        usuario.contrasena = encryptedPassword;
        await usuario.save();

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
});


// Ruta para obtener los usuarios con rol de 'cajero'
router.get('/cajeros', async (req, res) => {
    try {
        // Filtrar usuarios por el rol de 'cajero'
        const cajeros = await Usuario.find({ rol: 'cajero' });

        if (cajeros.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cajeros' });
        }

        // Enviar los cajeros encontrados como respuesta
        res.status(200).json(cajeros);
    } catch (error) {
        console.error('Error al obtener cajeros:', error);
        res.status(500).json({ message: 'Error al obtener los cajeros' });
    }
});

router.get('/domiciliario', async (req, res) => {
    try {
      const rol = req.query.rol;  // Se pasa el rol como query param
      const usuarios = await Usuario.find({ rol: rol });
  
      if (!usuarios) {
        return res.status(404).send('No se encontraron usuarios');
      }
  
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener los domiciliarios:', error);
      res.status(500).send('Error al obtener los domiciliarios');
    }
  });
  




module.exports = router;