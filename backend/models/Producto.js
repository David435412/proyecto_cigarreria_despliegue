// models/Producto.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: String, required: true},
  descripcion: { type: String, required: true},
  imagen: { type: String, required: true},
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  marca: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },
});

module.exports = mongoose.model('Productos', ProductoSchema);