// models/Proveedor.js
const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },
});

module.exports = mongoose.model('Proveedores', ProveedorSchema);