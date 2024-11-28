// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
  nombreUsuario: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },
  rol: { type: String, required: true, enum: ['cliente', 'cajero', 'administrador', 'domiciliario'] },
  codigoRecuperacion: { type: String, default: '' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);